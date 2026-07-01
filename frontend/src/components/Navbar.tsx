import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-blue-400 font-bold text-xl">☁</span>
        <span className="font-bold text-lg">Cost Intelligence Platform</span>
      </div>
      <div className="flex space-x-6">
        <button onClick={() => navigate('/dashboard')} className="hover:text-blue-400">Dashboard</button>
        <button onClick={() => navigate('/resources')} className="hover:text-blue-400">Resources</button>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700">Logout</button>
      </div>
    </nav>
  );
}
