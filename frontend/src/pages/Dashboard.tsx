import { useEffect, useState } from 'react';
import apiClient from '../api/client';

interface Summary {
  total_resources: number;
  active_resources: number;
  total_monthly_cost: number;
  total_yearly_cost: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    apiClient.get('/api/v1/analytics/summary').then((res) => {
      setSummary(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cost Dashboard</h1>
      {summary ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Total Resources</p>
            <p className="text-2xl font-bold">{summary.total_resources}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Monthly Cost</p>
            <p className="text-2xl font-bold">${summary.total_monthly_cost}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Yearly Cost</p>
            <p className="text-2xl font-bold">${summary.total_yearly_cost}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
