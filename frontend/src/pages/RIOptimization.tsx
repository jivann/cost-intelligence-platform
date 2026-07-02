import Layout from '../components/Layout';
import { ShoppingCart, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';

const recommendations = [
  { name: 'EC2 m5.xlarge', type: 'RI Purchase', region: 'us-east-1', term: '1-year', confidence: 95, savings: '$42,000/yr', color: 'text-green-600' },
  { name: 'RDS db.r5.2xlarge', type: 'RI Purchase', region: 'us-west-2', term: '3-year', confidence: 88, savings: '$65,000/yr', color: 'text-green-600' },
  { name: 'Compute SP', type: 'Savings Plan', region: 'Global', term: '1-year', confidence: 92, savings: '$28,000/yr', color: 'text-green-600' },
  { name: 'ElastiCache r6g.large', type: 'RI Purchase', region: 'eu-west-1', term: '1-year', confidence: 78, savings: '$8,500/yr', color: 'text-orange-500' },
  { name: 'EC2 c5.xlarge → c6i', type: 'RI Exchange', region: 'us-east-1', term: 'Remaining', confidence: 85, savings: '$12,000/yr', color: 'text-green-600' },
  { name: 'OpenSearch r6g.2xlarge', type: 'RI Purchase', region: 'ap-south-1', term: '3-year', confidence: 72, savings: '$18,000/yr', color: 'text-orange-500' },
];

const typeColor: Record<string, string> = {
  'RI Purchase': 'bg-blue-100 text-blue-700',
  'Savings Plan': 'bg-green-100 text-green-700',
  'RI Exchange': 'bg-purple-100 text-purple-700',
};

export default function RIOptimization() {
  const kpis = [
    { label: 'Overall Coverage', value: '74.2%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Potential Savings', value: '$174k', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active RIs', value: '142', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Expiring Soon', value: '18', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RI Optimization</h1>
            <p className="text-gray-500 text-sm mt-1">Reserved Instance recommendations and coverage analysis</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            <ShoppingCart size={14} /><span>Bulk Purchase</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-500 text-sm">{kpi.label}</p>
                  <div className={`${kpi.bg} p-2 rounded-lg`}><Icon size={16} className={kpi.color} /></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {['Recommendations', 'Coverage', 'Utilization', 'Purchase Simulator'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.name} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-4">
                <CheckCircle size={20} className={rec.confidence >= 85 ? 'text-green-500' : 'text-orange-400'} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{rec.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColor[rec.type]}`}>{rec.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{rec.region} · {rec.term} · {rec.confidence}% confidence</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`font-bold ${rec.color}`}>{rec.savings}</p>
                  <p className="text-xs text-gray-400">estimated savings</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Purchase</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
