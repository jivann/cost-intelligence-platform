"""
One-command demo data setup.

Populates the database with realistic synthetic cloud cost data (via
MockCostProvider), then injects one deliberate cost anomaly so the
/analytics/anomalies feature has something real to detect on a fresh setup.

This is demo/dev tooling only — see README's "Data & Demo Status" section
for what's real vs. synthetic in this project.

Usage:
    python -m backend.setup_demo_data
"""
from backend.sync_costs import sync
from backend.inject_demo_anomaly import inject


def main():
    print("Step 1/2: Syncing mock cost data...")
    sync()
    print("\nStep 2/2: Injecting one demo anomaly for testing...")
    inject()
    print("\nDone. Log in and visit the Dashboard and Anomalies pages to see the results.")


if __name__ == "__main__":
    main()
