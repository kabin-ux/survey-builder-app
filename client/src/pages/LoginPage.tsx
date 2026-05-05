import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password
      });

      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              S
            </div>
            <div className="text-left">
              <h1 className="text-sm font-semibold text-slate-900">Survey Builder</h1>
              <p className="text-xs text-slate-500">Admin Login</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-sm text-slate-600">Sign in to your admin account to manage surveys</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="space-y-3 text-center text-sm">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Create one
            </Link>
          </p>
          <Link to="/" className="block text-slate-600 hover:text-slate-900 transition-colors">
            ← Back to surveys
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
