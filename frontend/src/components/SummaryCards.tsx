interface Summary {
  total_resources: number;
  active_resources: number;
  stopped_resources: number;
  total_hourly_cost: number;
  total_monthly_cost: number;
  total_yearly_cost: number;
}

interface Props {
  summary: Summary;
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    { label: 'Total Resources', value: summary.total_resources, color: 'bg-blue-500' },
    { label: 'Active Resources', value: summary.active_resources, color: 'bg-green-500' },
    { label: 'Stopped Resources', value: summary.stopped_resources, color: 'bg-yellow-500' },
    { label: 'Hourly Cost', value: `$${summary.total_hourly_cost}`, color: 'bg-purple-500' },
    { label: 'Monthly Cost', value: `$${summary.total_monthly_cost}`, color: 'bg-red-500' },
    { label: 'Yearly Cost', value: `$${summary.total_yearly_cost}`, color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-lg shadow p-6">
          <div className={`w-10 h-10 ${card.color} rounded-full mb-3`}></div>
          <p className="text-gray-500 text-sm">{card.label}</p>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
