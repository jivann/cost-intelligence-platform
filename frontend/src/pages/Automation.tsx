import PlannedFeature from '../components/PlannedFeature';

export default function Automation() {
  return (
    <PlannedFeature
      title="Automation"
      description="Automated workflows for cost optimization"
      plannedCapabilities={[
        'Scheduled actions (e.g. auto-stop dev instances outside business hours)',
        'Automated cleanup of unattached/unused resources',
        'Budget threshold alerts with escalation rules',
        'Execution history and success/failure tracking',
      ]}
    />
  );
}
