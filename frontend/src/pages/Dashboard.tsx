import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService } from '../api/services';
import { DollarSign, Server, Layers } from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

interface Summary {
  total_resources: number;
  active_resources: number;
  stopped_resources: number;
  total_hourly_cost: number;
  total_monthly_cost: number;
  total_yearly_cost: number;
}

interface TypeCost {
  resource_type: string;
  resource_count: number;
  monthly_cost: number;
}

interface TopExpensive {
  id: number;
  name: string;
  provider: string;
  resource_type: string;
  region: string;
  monthly_cost: number;
}

interface TrendPoint {
  month: string;
  [provider: string]: string | number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byType, setByType] = useState<TypeCost[]>([]);
  const [topExpensive, setTopExpensive] = useState<TopExpensive[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      analyticsService.getSummary(),
      analyticsService.getByType(),
      analyticsService.getTopExpensive(),
      analyticsService.getTrend(),
    ])
      .then(([summaryData, typeData, topData, trendData]) => {
        setSummary(summaryData);
        setByType(typeData);
        setTopExpensive(topData);
        setTrend(trendData);
      })
      .catch(() => {
        setError('Unable to load dashboard data. The server may be unreachable — please try again shortly.');
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: 'Total Cloud Spend (Monthly)',
      value: summary ? `$${summary.total_monthly_cost.toLocaleString()}` : '—',
      icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50'
    },
    {
      label: 'Active Resources',
      value: summary ? summary.active_resources : '—',
      icon: Server, color: 'text-green-600', bg: 'bg-green-50'
    },
    {
      label: 'Stopped Resources',
      value: summary ? summary.stopped_resources : '—',
      icon: Layers, color: 'text-yellow-600', bg: 'bg-yellow-50'
    },
  ];

if (loading) {
    return (
      <Layout>
        <div className="p-6 text-gray-500">Loading real cost data…</div>
      </Layout>
    );
  }

const providerKeys = trend.length > 0 ? Object.keys(trend[0]).filter((k) => k !== 'month') : [];

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Multi-cloud cost visibility — synthetic data (see README for status)
          </p>
        </div>

        {/* KPI Cards — all real */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-500 text-sm">{kpi.label}</p>
                  <div className={`${kpi.bg} p-2 rounded-lg`}>
                    <Icon size={16} className={kpi.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Multi-Cloud Trend — real, from /analytics/trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Multi-Cloud Cost Trend</h2>
          <p className="text-gray-400 text-sm mb-4">Monthly spend by cloud provider (USD)</p>
          {trend.length === 0 ? (
            <p className="text-gray-400 text-sm">No trend data yet — run the sync script.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trend}>
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip formatter={(v) => [`$${v}`, '']} />
                <Legend />
                {providerKeys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Cost by Resource Type — real, from /analytics/by-type */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Cost by Resource Type</h2>
            <p className="text-gray-400 text-sm mb-4">Current distribution</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={byType} dataKey="monthly_cost" nameKey="resource_type" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {byType.map((item, i) => (
                <div key={item.resource_type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-gray-600">{item.resource_type}</span>
                  </div>
                  <span className="text-gray-900 font-medium">${item.monthly_cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Expensive Resources — real, from /analytics/top-expensive */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Top Expensive Resources</h2>
            <p className="text-gray-400 text-sm mb-4">Highest monthly cost, this account</p>
            <div className="space-y-3 mt-2">
              {topExpensive.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-900 font-medium">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.provider} · {r.resource_type} · {r.region}</p>
                  </div>
                  <span className="text-gray-900 font-semibold">${r.monthly_cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
