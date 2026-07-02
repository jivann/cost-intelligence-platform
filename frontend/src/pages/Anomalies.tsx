import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Bell, Eye, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const anomalies = [
  { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', name: 'Unusual EC2 spend spike', severity: 'critical', resource: 'i-0a1b2c3d4e5f6789a', time: '2 hours ago', amount: '+$12,400', expected: 'vs $2,100 expected' },
  { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', name: 'S3 data transfer anomaly', severity: 'warning', resource: 's3-data-lake-prod', time: '5 hours ago', amount: '+$3,800', expected: 'vs $1,200 expected' },
  { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', name: 'RDS storage growth', severity: 'warning', resource: 'db-analytics-primary', time: '8 hours ago', amount: '+$2,100', expected: 'vs $800 expected' },
  { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', name: 'Lambda invocation surge', severity: 'info', resource: 'lambda-etl-process', time: '12 hours ago', amount: '+$890', expected: 'vs $350 expected' },
];

const severityBadge: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
};

const spendPattern = Array.from({length: 30}, (_, i) => ({
  day: i + 1,
  actual: i === 22 ? 17500 : 2500 + Math.random() * 500,
  expected: 2800,
}));

export default function Anomalies() {
  const kpis = [
    { label: 'Active Anomalies', value: '4', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Critical', value: '1', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Warnings', value: '2', icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Resolved (30d)', value: '23', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'This Week', value: '7', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Anomalies</h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered cost anomaly detection and alerts</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Bell size={14} /><span>Configure Alerts</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              <Eye size={14} /><span>View All</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-xs">{kpi.label}</p>
                  <div className={`${kpi.bg} p-1.5 rounded-lg`}><Icon size={14} className={kpi.color} /></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {['Active (4)', 'History', 'Alert Rules'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex space-x-2 mb-4">
          {['All', 'Critical', 'Warning', 'Info'].map((f, i) => (
            <button key={f} className={`px-3 py-1 rounded-full text-sm ${i === 0 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {anomalies.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`${a.bg} p-2 rounded-lg`}><Icon size={16} className={a.color} /></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{a.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${severityBadge[a.severity]}`}>{a.severity}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{a.resource} · {a.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">{a.amount}</p>
                  <p className="text-xs text-gray-400">{a.expected}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Spend Pattern</h2>
          <p className="text-gray-400 text-sm mb-4">Detected anomaly on day 23</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={spendPattern}>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} />
              <Tooltip />
              <ReferenceLine x={23} stroke="#EF4444" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" dot={false} name="Actual" strokeWidth={2} />
              <Line type="monotone" dataKey="expected" stroke="#10B981" dot={false} name="Expected" strokeDasharray="5 5" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
