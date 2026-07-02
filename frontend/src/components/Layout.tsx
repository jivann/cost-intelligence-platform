import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/services';
import {
  LayoutDashboard, BarChart2, Shield, Tag, AlertTriangle, Zap,
  RefreshCw, Settings, Bell, ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cost-analysis', label: 'Cost Analysis', icon: BarChart2 },
  { path: '/ri-optimization', label: 'RI Optimization', icon: Shield },
  { path: '/tag-governance', label: 'Tag Governance', icon: Tag },
  { path: '/anomalies', label: 'Anomalies', icon: AlertTriangle, badge: 4 },
  { path: '/automation', label: 'Automation', icon: Zap },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">FO</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">FinOps</p>
              <p className="text-gray-500 text-xs">Orchestration</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
            <span className="text-gray-400 text-sm">Search...</span>
          </div>
          <div className="flex items-center space-x-4">
            <RefreshCw size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="relative">
              <Bell size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">4</span>
            </div>
            <Settings size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">FO</div>
              <span>FinOps Team</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
