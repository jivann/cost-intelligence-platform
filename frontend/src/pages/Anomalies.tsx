import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { analyticsService } from '../api/services';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Anomaly {
  resource_id: string;
  resource_name: string;
  provider: string;
  severity: 'critical' | 'warning' | 'info';
  latest_amount: number;
  expected_amount: number;
  pct_above_expected: number;
  detected_at: string;
}

interface AnomaliesResponse {
  total: number;
  critical: number;
  warning: number;
  info: number;
  anomalies: Anomaly[];
  method: string;
}

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
};

export default function Anomalies() {
  const [data, setData] = useState<AnomaliesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnomalies()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Active Anomalies', value: data?.total ?? '—', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Critical', value: data?.critical ?? '—', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Warning', value: data?.warning ?? '—', icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Info', value: data?.info ?? '—', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-gray-500">Checking for anomalies…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Anomalies</h1>
          <p className="text-gray-500 text-sm mt-1">
            Rule-based cost anomaly detection — not ML-based (see method below)
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
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

        {data && data.anomalies.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
            <p className="text-gray-900 font-medium">No anomalies detected</p>
            <p className="text-gray-500 text-sm mt-1">
              All resources are within their normal 7-day spending range.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {data?.anomalies.map((a) => {
              const config = severityConfig[a.severity];
              const Icon = config.icon;
              return (
                <div key={a.resource_id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`${config.bg} p-2 rounded-lg`}><Icon size={16} className={config.color} /></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{a.resource_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${config.badge}`}>{a.severity}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {a.resource_id} · {a.provider} · {new Date(a.detected_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-500">${a.latest_amount}</p>
                    <p className="text-xs text-gray-400">
                      vs ${a.expected_amount} expected (+{a.pct_above_expected}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data && (
          <p className="text-xs text-gray-400 mt-4">
            Detection method: {data.method}
          </p>
        )}
      </div>
    </Layout>
  );
}
