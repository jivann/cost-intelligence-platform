# Security Scanning Report

## Image Scanning (Trivy v0.71.2)

Scanned on: 2026-07-06

### Backend (cost-backend:day27, base: python:3.11-slim)
- **Fixed**: `wheel` (0.45.1→0.46.2) and `jaraco.context` (5.3.0→6.1.0) upgraded via explicit `pip install --upgrade pip setuptools wheel` in Dockerfile.
- **Accepted risk (no fix available upstream)**: 13 CRITICAL/HIGH findings in Debian base OS packages (`perl-base`, `gzip`, `ncurses`, `libacl1`) and the `ecdsa` Python library. These have no patched version currently published by their maintainers. Re-scan periodically as new Trivy DB updates may reflect newly available patches.

### Frontend (cost-frontend:day24c, base: nginx:alpine)
- **0 CRITICAL/HIGH vulnerabilities** — Alpine's minimal package set results in a substantially smaller attack surface than Debian-based images.

## Process
Run before deploying any new image build:
```bash
trivy image --severity CRITICAL,HIGH <image>:<tag>
```
Fix any CVE with an available `Fixed Version`. Document and accept any CVE with `NO FIX AVAILABLE`, and re-check on next scan.
