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
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Cost Overview</h1>
          <p className="text-gray-400 mt-1">Real-time multi-cloud cost intelligence</p>
        </div>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1 text-white">Cost by Provider</h2>
            <p className="text-gray-400 text-sm mb-4">Monthly spend distribution</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byProvider} dataKey="monthly_cost" nameKey="provider" cx="50%" cy="50%" outerRadius={90} label={({name, value}) => `${name}: $${value}`}>
                  {byProvider.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor:'#1F2937', border:'1px solid #374151', borderRadius:'8px'}} formatter={(value) => [`$${value}`, 'Monthly Cost']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1 text-white">Cost by Region</h2>
            <p className="text-gray-400 text-sm mb-4">Monthly spend per region</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byRegion}>
                <XAxis dataKey="region" stroke="#6B7280" tick={{fill:'#9CA3AF', fontSize:11}} />
                <YAxis stroke="#6B7280" tick={{fill:'#9CA3AF'}} />
                <Tooltip contentStyle={{backgroundColor:'#1F2937', border:'1px solid #374151', borderRadius:'8px'}} formatter={(value) => [`$${value}`, 'Monthly Cost']} />
                <Bar dataKey="monthly_cost" fill="#3B82F6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-1 text-white">Top Expensive Resources</h2>
          <p className="text-gray-400 text-sm mb-4">Highest monthly cost resources</p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-3 text-gray-400 font-medium">Name</th>
                <th className="pb-3 text-gray-400 font-medium">Provider</th>
                <th className="pb-3 text-gray-400 font-medium">Type</th>
                <th className="pb-3 text-gray-400 font-medium">Region</th>
                <th className="pb-3 text-gray-400 font-medium">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {topExpensive.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-3 text-white">{r.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs uppercase">{r.provider}</span>
                  </td>
                  <td className="py-3 text-gray-300">{r.resource_type}</td>
                  <td className="py-3 text-gray-300">{r.region}</td>
                  <td className="py-3 font-bold text-red-400">${r.monthly_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
