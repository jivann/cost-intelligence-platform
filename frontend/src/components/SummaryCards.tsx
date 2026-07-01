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
    { label: 'Total Resources', value: summary.total_resources, icon: '🖥️', color: 'border-blue-500', text: 'text-blue-400' },
    { label: 'Active Resources', value: summary.active_resources, icon: '✅', color: 'border-green-500', text: 'text-green-400' },
    { label: 'Stopped Resources', value: summary.stopped_resources, icon: '⏸️', color: 'border-yellow-500', text: 'text-yellow-400' },
    { label: 'Hourly Cost', value: `$${summary.total_hourly_cost}`, icon: '⏱️', color: 'border-purple-500', text: 'text-purple-400' },
    { label: 'Monthly Cost', value: `$${summary.total_monthly_cost}`, icon: '📅', color: 'border-red-500', text: 'text-red-400' },
    { label: 'Yearly Cost', value: `$${summary.total_yearly_cost}`, icon: '📊', color: 'border-orange-500', text: 'text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className={`bg-gray-900 border-l-4 ${card.color} border border-gray-800 rounded-xl p-5`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.text}`}>{card.value}</p>
            </div>
            <span className="text-2xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
