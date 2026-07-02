import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService } from '../api/services';
import { TrendingDown, TrendingUp, DollarSign, Percent, Shield, AlertTriangle } from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

const multiCloudTrend = [
  { month: 'Jan', AWS: 420, Azure: 280, GCP: 160 },
  { month: 'Feb', AWS: 380, Azure: 310, GCP: 140 },
  { month: 'Mar', AWS: 450, Azure: 290, GCP: 180 },
  { month: 'Apr', AWS: 410, Azure: 320, GCP: 160 },
  { month: 'May', AWS: 480, Azure: 300, GCP: 200 },
  { month: 'Jun', AWS: 440, Azure: 340, GCP: 190 },
];

const costByService = [
  { name: 'Compute', value: 42 },
  { name: 'Storage', value: 18 },
  { name: 'Network', value: 12 },
  { name: 'Database', value: 15 },
  { name: 'Other', value: 13 },
];

const riCoverage = [
  { name: 'Compute', coverage: 82 },
  { name: 'Database', coverage: 68 },
  { name: 'Cache', coverage: 45 },
  { name: 'Analytics', coverage: 30 },
];

const spendForecast = Array.from({length: 30}, (_, i) => ({
  day: i + 1,
  budget: 1400 + i * 2,
  forecast: 900 + i * 12 + Math.random() * 50,
}));

const costByEnv = [
  { name: 'Production', value: 42, amount: '$520k' },
  { name: 'Staging', value: 15, amount: '$185k' },
  { name: 'Development', value: 25, amount: '$310k' },
  { name: 'QA/Testing', value: 11, amount: '$135k' },
  { name: 'DR/Backup', value: 7, amount: '$100k' },
];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [byProvider, setByProvider] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getSummary().then(setSummary);
    analyticsService.getByProvider().then(setByProvider);
  }, []);

  const kpis = [
    { label: 'Total Cloud Spend', value: summary ? `$${summary.total_monthly_cost.toLocaleString()}` : '$0', change: '-3.2%', up: false, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Effective Savings Rate', value: '28.4%', change: '+2.1% vs last month', up: true, icon: Percent, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'RI Coverage', value: '74.2%', change: '+5.3% vs last month', up: true, icon: Shield, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Active Anomalies', value: '4', change: '-2% vs yesterday', up: false, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Multi-cloud cost visibility and KPIs</p>
          </div>
          <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <span>Last 30 days</span>
            <span>▾</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
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
                <p className={`text-xs mt-1 flex items-center space-x-1 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{kpi.change}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Multi-Cloud Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Multi-Cloud Cost Trend</h2>
          <p className="text-gray-400 text-sm mb-4">Monthly spend by cloud provider (USD)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={multiCloudTrend}>
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip formatter={(v) => [`$${v}k`, '']} />
              <Legend />
              <Bar dataKey="AWS" fill="#3B82F6" radius={[3,3,0,0]} />
              <Bar dataKey="Azure" fill="#F59E0B" radius={[3,3,0,0]} />
              <Bar dataKey="GCP" fill="#10B981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Cost by Service Donut */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Cost by Service</h2>
            <p className="text-gray-400 text-sm mb-4">Current month distribution</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={costByService} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                    {costByService.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {costByService.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* RI Coverage */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">RI/Commitment Coverage by Service</h2>
            <p className="text-gray-400 text-sm mb-4">Purchased hours vs total usage hours</p>
            <div className="space-y-4 mt-4">
              {riCoverage.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.coverage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.coverage}%`,
                        backgroundColor: item.coverage > 70 ? '#3B82F6' : item.coverage > 50 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Overall Coverage</span>
                <span className="font-bold text-gray-900">74.2%</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Annual Savings from Commitments</span>
                <span className="font-bold text-green-600">↗ $2.8M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spend Forecast */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Spend Forecast vs Budget</h2>
          <p className="text-gray-400 text-sm mb-4">30-day projection with 90% confidence interval</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={spendForecast}>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="budget" stroke="#9CA3AF" strokeDasharray="5 5" dot={false} name="Budget" />
              <Line type="monotone" dataKey="forecast" stroke="#3B82F6" dot={false} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex space-x-6 text-sm mt-3">
            <span className="text-gray-500">— Budget <strong>$1.4M</strong></span>
            <span className="text-blue-500">— Forecast <strong>$1.25M</strong></span>
            <span className="text-green-600">Variance <strong>-10.7%</strong></span>
          </div>
        </div>

        {/* Cost by Environment */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Cost by Environment</h2>
          <div className="space-y-3">
            {costByEnv.map((item, i) => (
              <div key={item.name} className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 w-28">{item.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.value * 2}%`}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">{item.amount}</span>
                <span className="text-sm text-gray-400 w-10 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
