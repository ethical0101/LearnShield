import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@edu.com', role: 'Admin', color: 'purple' },
    { email: 'mentor@edu.com', role: 'Mentor', color: 'blue' },
    { email: 'parent@edu.com', role: 'Guardian', color: 'green' },
    { email: 'student@edu.com', role: 'Student', color: 'orange' }
  ];

  const fillCredentials = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">LearnShield</h2>
          <p className="mt-2 text-sm text-gray-600">
            Multi-Role Student Risk Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center p-3 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="mb-3 text-xs text-center text-gray-500">Demo Accounts (Password: password123)</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(({ email, role, color }) => (
                <button
                  key={email}
                  onClick={() => fillCredentials(email)}
                  className={`text-xs p-2 rounded-lg border-2 border-${color}-200 bg-${color}-50 text-${color}-700 hover:bg-${color}-100 transition-colors`}
                >
                  <div className="font-medium">{role}</div>
                  <div className="text-xs opacity-75">{email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
