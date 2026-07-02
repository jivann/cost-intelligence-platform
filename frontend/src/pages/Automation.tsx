import Layout from '../components/Layout';
import { Zap, Plus, Pause, Play, Settings, Trash2, CheckCircle, Clock } from 'lucide-react';

const workflows = [
  { name: 'Auto-stop dev instances', status: 'Active', desc: 'Stop all dev EC2 instances outside business hours', schedule: 'Schedule (Mon-Fri 7PM)', lastRun: '2 hours ago', success: '99% success', tags: ['Stop EC2', 'Send Slack'] },
  { name: 'RI Purchase Approval', status: 'Active', desc: 'Auto-approve RI purchases under $50k with 90%+ confidence', schedule: 'Recommendation generated', lastRun: '5 hours ago', success: '100% success', tags: ['Check budget', 'Purchase RI', 'Notify team'] },
  { name: 'Cleanup unused volumes', status: 'Active', desc: 'Delete unattached EBS volumes older than 30 days', schedule: 'Daily at 2AM', lastRun: '1 day ago', success: '98% success', tags: ['Find volumes', 'Create snapshot', 'Delete volume'] },
  { name: 'Tag enforcement', status: 'Paused', desc: 'Alert on resources missing required tags', schedule: 'Hourly', lastRun: '3 days ago', success: '95% success', tags: ['Scan resources', 'Check tags', 'Send alert'] },
  { name: 'Budget alert escalation', status: 'Active', desc: 'Escalate to management when budget > 95%', schedule: 'Budget threshold', lastRun: '12 hours ago', success: '100% success', tags: ['Check budget', 'Send email', 'Create ticket'] },
  { name: 'Right-size underutilized', status: 'Active', desc: 'Recommend rightsizing for < 20% CPU utilization', schedule: 'Weekly (Monday)', lastRun: '2 days ago', success: '97% success', tags: ['Analyze metrics', 'Generate report', 'Send recommendations'] },
];

export default function Automation() {
  const kpis = [
    { label: 'Active Workflows', value: '5', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Paused', value: '1', icon: Pause, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Runs Today', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Success Rate', value: '98.2%', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
            <p className="text-gray-500 text-sm mt-1">Automated workflows for cost optimization</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            <Plus size={14} /><span>Create Workflow</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm">{kpi.label}</p>
                  <div className={`${kpi.bg} p-2 rounded-lg`}><Icon size={16} className={kpi.color} /></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {['Workflows', 'Execution History', 'Templates'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg mt-0.5">
                    <Zap size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{wf.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${wf.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {wf.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{wf.desc}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center space-x-1"><Clock size={11} /><span>{wf.schedule}</span></span>
                      <span>· Last run: {wf.lastRun}</span>
                      <span className="text-green-600 font-medium">· {wf.success}</span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      {wf.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {wf.status === 'Paused' ? (
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Play size={16} className="text-gray-400" /></button>
                  ) : (
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Pause size={16} className="text-gray-400" /></button>
                  )}
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Settings size={16} className="text-gray-400" /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Trash2 size={16} className="text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
