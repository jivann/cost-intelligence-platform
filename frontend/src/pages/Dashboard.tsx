import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import { analyticsService } from '../api/services';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [byProvider, setByProvider] = useState<any[]>([]);
  const [byRegion, setByRegion] = useState<any[]>([]);
  const [topExpensive, setTopExpensive] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getSummary().then(setSummary);
    analyticsService.getByProvider().then(setByProvider);
    analyticsService.getByRegion().then(setByRegion);
    analyticsService.getTopExpensive().then(setTopExpensive);
  }, []);

  if (!summary) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-xl">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cost Overview</h1>
        <SummaryCards summary={summary} />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Cost by Provider</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byProvider} dataKey="monthly_cost" nameKey="provider" cx="50%" cy="50%" outerRadius={80} label>
                  {byProvider.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Cost by Region</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byRegion}>
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="monthly_cost" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Expensive Resources</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-gray-500">Name</th>
                <th className="pb-2 text-gray-500">Provider</th>
                <th className="pb-2 text-gray-500">Type</th>
                <th className="pb-2 text-gray-500">Region</th>
                <th className="pb-2 text-gray-500">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {topExpensive.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{r.name}</td>
                  <td className="py-3 uppercase">{r.provider}</td>
                  <td className="py-3">{r.resource_type}</td>
                  <td className="py-3">{r.region}</td>
                  <td className="py-3 font-bold text-red-600">${r.monthly_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
