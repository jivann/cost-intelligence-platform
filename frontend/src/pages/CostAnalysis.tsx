import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService } from '../api/services';
import { Filter, Download } from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981'];

const dailySpend = Array.from({length: 30}, (_, i) => ({
  day: i + 1,
  spend: 30000 + Math.random() * 15000,
}));

const topServices = [
  { service: 'EC2 / Compute', cloud: 'AWS', cost: '$525,000', pct: '42%', change: '+5.2%', up: true },
  { service: 'S3 / Storage', cloud: 'AWS', cost: '$180,000', pct: '14.4%', change: '-2.1%', up: false },
  { service: 'RDS / Database', cloud: 'AWS', cost: '$165,000', pct: '13.2%', change: '+8.4%', up: true },
  { service: 'Azure VMs', cloud: 'Azure', cost: '$148,000', pct: '11.8%', change: '+3.7%', up: true },
  { service: 'Cloud SQL', cloud: 'GCP', cost: '$92,000', pct: '7.4%', change: '-1.5%', up: false },
  { service: 'Data Transfer', cloud: 'Multi', cost: '$75,000', pct: '6%', change: '+12.3%', up: true },
  { service: 'Lambda / Functions', cloud: 'AWS', cost: '$48,000', pct: '3.8%', change: '-5.2%', up: false },
  { service: 'Others', cloud: 'Multi', cost: '$22,000', pct: '1.4%', change: '+1.1%', up: true },
];

const cloudBadgeColor: Record<string, string> = {
  AWS: 'bg-orange-100 text-orange-700',
  Azure: 'bg-blue-100 text-blue-700',
  GCP: 'bg-green-100 text-green-700',
  Multi: 'bg-gray-100 text-gray-700',
};

export default function CostAnalysis() {
  const [byProvider, setByProvider] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    analyticsService.getByProvider().then(setByProvider);
    analyticsService.getSummary().then(setSummary);
  }, []);

  const providerCards = [
    { label: 'Total Spend', value: summary ? `$${summary.total_monthly_cost.toLocaleString()}` : '$0', change: '-3.2%', color: 'text-gray-900' },
    { label: 'AWS', value: '$650,000', change: '+2.1%', color: 'text-blue-600' },
    { label: 'Azure', value: '$400,000', change: '-1.5%', color: 'text-orange-500' },
    { label: 'GCP', value: '$200,000', change: '+8.4%', color: 'text-green-600' },
  ];

  const pieData = byProvider.length > 0 ? byProvider.map(p => ({name: p.provider.toUpperCase(), value: p.monthly_cost})) : [
    {name: 'AWS', value: 650}, {name: 'Azure', value: 400}, {name: 'GCP', value: 200}
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cost Analysis</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed cost breakdown and allocation analysis</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} /><span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Download size={14} /><span>Export</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Last 30 days ▾</button>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {providerCards.map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-2">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className={`text-xs mt-1 ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{card.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {['Overview', 'By Service', 'By Team', 'Trends'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Cloud Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Cloud Distribution</h2>
          <p className="text-gray-400 text-sm mb-4">Spend by cloud provider</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`$${v}k`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">${typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spend Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Daily Spend Trend</h2>
          <p className="text-gray-400 text-sm mb-4">Last 30 days spend pattern</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailySpend}>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`$${(v/1000).toFixed(1)}k`, 'Spend']} />
              <Area type="monotone" dataKey="spend" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cost Services */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Top Cost Services</h2>
          <p className="text-gray-400 text-sm mb-4">Highest spending services this month</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase pb-3">Service</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase pb-3">Cloud</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase pb-3">Cost</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase pb-3">% of Total</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase pb-3">MoM Change</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((row) => (
                <tr key={row.service} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{row.service}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${cloudBadgeColor[row.cloud]}`}>{row.cloud}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-900 text-right font-medium">{row.cost}</td>
                  <td className="py-3 text-sm text-gray-500 text-right">{row.pct}</td>
                  <td className={`py-3 text-sm text-right font-medium ${row.up ? 'text-red-500' : 'text-green-600'}`}>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
