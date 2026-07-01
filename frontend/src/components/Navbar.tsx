import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/services';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CI</span>
        </div>
        <span className="font-bold text-white text-lg">Cost Intelligence</span>
        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Enterprise</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate('/dashboard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/resources')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/resources') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          Resources
        </button>
        <button onClick={handleLogout} className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
          Logout
        </button>
      </div>
    </nav>
  );
}
