import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', cleanUsername);
        formData.append('password', cleanPassword);
        const response = await apiClient.post('/api/v1/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/dashboard');
      } else {
        await apiClient.post('/api/v1/register', { email: cleanEmail, username: cleanUsername, password: cleanPassword });
        setIsLogin(true);
        setError('');
        alert('Account created! Please sign in.');
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || (isLogin ? 'Login failed — please try again.' : 'Registration failed — please try again.'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CI</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Cost Intelligence</h1>
          <p className="text-gray-400 mt-2">Enterprise Multi-Cloud Platform</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">Multi-Cloud Cost Intelligence Platform v1.0</p>
      </div>
    </div>
  );
}
