#!/usr/bin/env python3
"""
Repo Scanner — finds deployment/security gaps in target companies' public GitHub repos.
Use case: find a specific, real issue to mention in cold outreach emails.

Usage:
    python3 scan_repos.py repos.txt
    (repos.txt = one GitHub repo URL per line)

Output:
    - Prints a summary report to console
    - Saves detailed findings to report.json
"""

import os
import re
import sys
import json
import base64
import requests
from pathlib import Path

GITHUB_API = "https://api.github.com"

# Reads from environment variable — never hardcode tokens in this file.
# Set it in your terminal before running:
#   export GITHUB_TOKEN="your_token_here"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

HEADERS = {"Accept": "application/vnd.github+json"}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"
else:
    print("Warning: GITHUB_TOKEN not set. You'll be limited to 60 requests/hour.")
    print('Set it with: export GITHUB_TOKEN="your_token_here"\n')

# Patterns that suggest a real secret (kept conservative to reduce false positives)
SECRET_PATTERNS = [
    (r'AKIA[0-9A-Z]{16}', "AWS Access Key ID"),
    (r'AIza[0-9A-Za-z\-_]{35}', "Google API Key"),
    (r'sk_live_[0-9a-zA-Z]{24,}', "Stripe Live Secret Key"),
    (r'ghp_[0-9a-zA-Z]{36}', "GitHub Personal Access Token"),
    (r'xox[baprs]-[0-9a-zA-Z\-]{10,}', "Slack Token"),
    (r'-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----', "Private Key"),
    (r'mongodb(\+srv)?://[^\s"\']+:[^\s"\']+@', "MongoDB URI with credentials"),
    (r'postgres(ql)?://[^\s"\']+:[^\s"\']+@', "Postgres URI with credentials"),
]

FILES_TO_CHECK_FOR_SECRETS = [
    ".env", "config.js", "config.py", "settings.py", "docker-compose.yml",
    "docker-compose.yaml", "application.properties", "appsettings.json",
]


def parse_repo_url(url):
    """Extract owner/repo from a GitHub URL."""
    m = re.search(r'github\.com/([^/]+)/([^/\s]+)', url)
    if not m:
        return None, None
    owner, repo = m.group(1), m.group(2).replace(".git", "")
    return owner, repo


def get_default_branch(owner, repo):
    r = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}", headers=HEADERS)
    if r.status_code != 200:
        return None, r.status_code
    return r.json().get("default_branch", "main"), 200


def get_repo_tree(owner, repo, branch):
    r = requests.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1",
        headers=HEADERS,
    )
    if r.status_code != 200:
        return []
    return r.json().get("tree", [])


def get_file_content(owner, repo, path):
    r = requests.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}", headers=HEADERS
    )
    if r.status_code != 200:
        return None
    data = r.json()
    if data.get("encoding") == "base64":
        try:
            return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
        except Exception:
            return None
    return None


def check_dockerfile_root(content):
    """Flag if Dockerfile has no USER instruction (runs as root by default)."""
    if not content:
        return False
    has_user = re.search(r'^\s*USER\s+(?!root)\S+', content, re.MULTILINE)
    return not has_user


def check_secrets_in_content(content, filename):
    findings = []
    if not content:
        return findings
    for pattern, label in SECRET_PATTERNS:
        if re.search(pattern, content):
            findings.append(f"{label} pattern found in {filename}")
    return findings


def check_for_ci(tree_paths):
    ci_indicators = [
        ".github/workflows", ".gitlab-ci.yml", ".circleci/config.yml",
        "Jenkinsfile", ".travis.yml",
    ]
    for path in tree_paths:
        for indicator in ci_indicators:
            if indicator in path:
                return True
    return False


def check_for_env_example(tree_paths):
    return any(p in (".env.example", ".env.sample", ".env.template") for p in tree_paths)


def check_for_backup_script(tree_paths):
    backup_keywords = ["backup", "restore", "dump"]
    return any(any(kw in p.lower() for kw in backup_keywords) for p in tree_paths)


def scan_repo(url):
    owner, repo = parse_repo_url(url)
    if not owner:
        return {"url": url, "error": "Could not parse GitHub URL"}

    result = {"url": url, "owner": owner, "repo": repo, "flags": [], "clean": []}

    branch, status = get_default_branch(owner, repo)
    if status == 404:
        result["error"] = "Repo not found or private"
        return result
    if status == 403:
        result["error"] = "Rate limited — add a GITHUB_TOKEN to the script"
        return result
    if status != 200:
        result["error"] = f"GitHub API returned {status}"
        return result

    tree = get_repo_tree(owner, repo, branch)
    tree_paths = [t["path"] for t in tree if t["type"] == "blob"]

    # Check 1: Dockerfile running as root
    dockerfile_paths = [p for p in tree_paths if p.split("/")[-1] == "Dockerfile"]
    if dockerfile_paths:
        content = get_file_content(owner, repo, dockerfile_paths[0])
        if check_dockerfile_root(content):
            result["flags"].append(
                f"Dockerfile ({dockerfile_paths[0]}) has no USER instruction — likely runs as root"
            )
        else:
            result["clean"].append("Dockerfile sets a non-root USER")
    else:
        result["clean"].append("No Dockerfile found (may not be containerized)")

    # Check 2: CI/CD
    if check_for_ci(tree_paths):
        result["clean"].append("CI/CD config found")
    else:
        result["flags"].append("No CI/CD config found (.github/workflows, etc.)")

    # Check 3: secrets in common config files
    for fname in FILES_TO_CHECK_FOR_SECRETS:
        matches = [p for p in tree_paths if p.split("/")[-1] == fname]
        for path in matches:
            content = get_file_content(owner, repo, path)
            findings = check_secrets_in_content(content, path)
            result["flags"].extend(findings)

    # Check 4: .env.example present (sign of decent config hygiene)
    if check_for_env_example(tree_paths):
        result["clean"].append(".env.example present (good config hygiene sign)")
    else:
        result["flags"].append("No .env.example found — unclear how secrets/config are managed")

    # Check 5: any backup/restore scripts
    if check_for_backup_script(tree_paths):
        result["clean"].append("Backup/restore related files found")
    else:
        result["flags"].append("No backup/restore scripts found in repo")

    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scan_repos.py repos.txt")
        sys.exit(1)

    repo_file = Path(sys.argv[1])
    if not repo_file.exists():
        print(f"File not found: {repo_file}")
        sys.exit(1)

    urls = [line.strip() for line in repo_file.read_text().splitlines() if line.strip()]

    print(f"Scanning {len(urls)} repos...\n")
    all_results = []

    for url in urls:
        print(f"-> {url}")
        result = scan_repo(url)
        all_results.append(result)

        if "error" in result:
            print(f"   ERROR: {result['error']}\n")
            continue

        if result["flags"]:
            print(f"   🚩 {len(result['flags'])} flag(s):")
            for f in result["flags"]:
                print(f"      - {f}")
        else:
            print("   ✅ No flags found")
        print()

    Path("report.json").write_text(json.dumps(all_results, indent=2))
    print(f"\nFull report saved to report.json")

    # Sort by most flags = best outreach targets
    flagged = sorted(
        [r for r in all_results if "error" not in r],
        key=lambda r: len(r["flags"]),
        reverse=True,
    )
    print("\n=== TOP OUTREACH TARGETS (most flags first) ===")
    for r in flagged[:10]:
        if r["flags"]:
            print(f"{r['url']} — {len(r['flags'])} flags")


if __name__ == "__main__":
    main()
