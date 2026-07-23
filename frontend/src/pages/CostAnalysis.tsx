import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService } from '../api/services';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

interface ProviderCost {
  provider: string;
  resource_count: number;
  monthly_cost: number;
}

interface TypeCost {
  resource_type: string;
  resource_count: number;
  monthly_cost: number;
}

interface Summary {
  total_monthly_cost: number;
}

export default function CostAnalysis() {
  const [byProvider, setByProvider] = useState<ProviderCost[]>([]);
  const [byType, setByType] = useState<TypeCost[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getByProvider(),
      analyticsService.getByType(),
      analyticsService.getSummary(),
      analyticsService.getTrend(),
    ])
      .then(([providerData, typeData, summaryData, trendData]) => {
        setByProvider(providerData);
        setByType(typeData);
        setSummary(summaryData);
        setTrend(trendData);
      })
      .finally(() => setLoading(false));
  }, []);

  const providerKeys = trend.length > 0
    ? Object.keys(trend[0]).filter((k) => k !== 'month')
    : [];

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-gray-500">Loading cost analysis…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cost Analysis</h1>
          <p className="text-gray-500 text-sm mt-1">Detailed cost breakdown and allocation analysis</p>
        </div>

        {/* Provider Cards — real */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-500 text-sm mb-2">Total Spend</p>
            <p className="text-2xl font-bold text-gray-900">
              ${summary ? summary.total_monthly_cost.toLocaleString() : '0'}
            </p>
          </div>
          {byProvider.map((p) => (
            <div key={p.provider} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-2">{p.provider.toUpperCase()}</p>
              <p className="text-2xl font-bold text-gray-900">${p.monthly_cost.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{p.resource_count} resources</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Cloud Distribution — real */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Cloud Distribution</h2>
            <p className="text-gray-400 text-sm mb-4">Spend by cloud provider</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={byProvider} dataKey="monthly_cost" nameKey="provider" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {byProvider.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`$${v}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend — real, from /analytics/trend */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Cost Trend by Month</h2>
            <p className="text-gray-400 text-sm mb-4">Grouped by provider</p>
            {trend.length === 0 ? (
              <p className="text-gray-400 text-sm">No trend data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trend}>
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip formatter={(v) => [`$${v}`, '']} />
                  <Legend />
                  {providerKeys.map((key, i) => (
                    <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Cost by Resource Type — real, from /analytics/by-type */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Cost by Resource Type</h2>
          <p className="text-gray-400 text-sm mb-4">Highest spending resource types</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase pb-3">Resource Type</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase pb-3">Resource Count</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase pb-3">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {[...byType].sort((a, b) => b.monthly_cost - a.monthly_cost).map((row) => (
                <tr key={row.resource_type} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{row.resource_type}</td>
                  <td className="py-3 text-sm text-gray-500 text-right">{row.resource_count}</td>
                  <td className="py-3 text-sm text-gray-900 text-right font-medium">${row.monthly_cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
