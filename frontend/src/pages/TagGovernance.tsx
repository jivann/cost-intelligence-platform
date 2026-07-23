import PlannedFeature from '../components/PlannedFeature';

export default function TagGovernance() {
  return (
    <PlannedFeature
      title="Tag Governance"
      description="Monitor and enforce tagging compliance across resources"
      plannedCapabilities={[
        'Required-tag policy definitions (e.g. Environment, Owner, Cost Center)',
        'Real-time compliance scoring per policy',
        'Untagged resource detection and reporting',
        'Environment-based resource breakdown',
      ]}
    />
  );
}
