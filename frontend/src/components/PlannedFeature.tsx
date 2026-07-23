import { Construction } from 'lucide-react';
import Layout from './Layout';

interface Props {
  title: string;
  description: string;
  plannedCapabilities: string[];
}

export default function PlannedFeature({ title, description, plannedCapabilities }: Props) {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Construction className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-medium text-blue-900">On the Roadmap</p>
              <p className="text-sm text-blue-800 mt-1">
                This page shows the intended design and scope. It was deliberately sequenced
                after the core cost-visibility features (Dashboard, Anomalies) — which are
                live and running on real synced data — so the highest-value features shipped
                first.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Planned capabilities</h2>
          <ul className="space-y-2">
            {plannedCapabilities.map((cap) => (
              <li key={cap} className="flex items-start space-x-2 text-sm text-gray-600">
                <span className="text-gray-300 mt-1">○</span>
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
