import PlannedFeature from '../components/PlannedFeature';

export default function RIOptimization() {
  return (
    <PlannedFeature
      title="RI Optimization"
      description="Reserved Instance recommendations and coverage analysis"
      plannedCapabilities={[
        'RI/Savings Plan purchase recommendations based on usage patterns',
        'Coverage and utilization tracking',
        'Expiration alerts for existing commitments',
        'Estimated savings modeling before purchase',
      ]}
    />
  );
}
