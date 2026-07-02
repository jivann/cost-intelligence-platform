import Layout from '../components/Layout';
import { Tag, Plus } from 'lucide-react';

const policies = [
  { name: 'Environment Tag Required', severity: 'critical', resources: 2847, compliance: 94, color: '#10B981' },
  { name: 'Owner Tag Required', severity: 'critical', resources: 2847, compliance: 88, color: '#F59E0B' },
  { name: 'Cost Center Tag', severity: 'warning', resources: 2412, compliance: 72, color: '#F59E0B' },
  { name: 'Project Tag', severity: 'warning', resources: 2156, compliance: 65, color: '#EF4444' },
  { name: 'Backup Policy Tag', severity: 'info', resources: 1890, compliance: 45, color: '#EF4444' },
  { name: 'Data Classification', severity: 'critical', resources: 567, compliance: 91, color: '#10B981' },
];

const environments = [
  { name: 'Production', count: 1245, pct: 43.7 },
  { name: 'Staging', count: 520, pct: 18.3 },
  { name: 'Development', count: 680, pct: 23.9 },
  { name: 'QA', count: 280, pct: 9.8 },
  { name: 'Untagged', count: 122, pct: 4.3, red: true },
];

const severityColor: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function TagGovernance() {
  const kpis = [
    { label: 'Overall Compliance', value: '78%', icon: '⚠️' },
    { label: 'Required Tags', value: '92%', icon: '✅' },
    { label: 'Optional Tags', value: '65%', icon: '⚠️' },
    { label: 'Untagged Resources', value: '156', icon: '❌' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tag Governance</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and enforce tagging compliance across resources</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              <span>⟳</span><span>Auto-Fix All</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Plus size={14} /><span>Add Policy</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm">{kpi.label}</p>
                <span className="text-lg">{kpi.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {['Overview', 'Violations (7)', 'Policies', 'Tag Explorer'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Compliance by Policy</h2>
          <div className="space-y-5">
            {policies.map((policy) => (
              <div key={policy.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${severityColor[policy.severity]}`}>{policy.severity}</span>
                    <span className="text-sm font-medium text-gray-900">{policy.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{color: policy.color}}>{policy.compliance}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                  <div className="h-2 rounded-full transition-all" style={{width: `${policy.compliance}%`, backgroundColor: policy.color}}></div>
                </div>
                <p className="text-xs text-gray-400">{policy.resources.toLocaleString()} resources</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Tag size={16} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Environment</h2>
          </div>
          <div className="space-y-3">
            {environments.map((env) => (
              <div key={env.name} className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 w-28">{env.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${env.red ? 'bg-red-400' : 'bg-blue-500'}`} style={{width: `${env.pct * 2}%`}}></div>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{env.count.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">{env.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
