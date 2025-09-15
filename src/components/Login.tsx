import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';
import { useData } from '../context/DataContext';

const roles = ['Admin', 'Mentor', 'Guardian', 'Student'] as const;

const Login: React.FC = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const { students } = useData();
  // FIX: Use useData hook instead of require
  // import { useData } from '../context/DataContext';
  // const { students } = useData();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<'Admin' | 'Mentor' | 'Guardian' | 'Student'>('Student');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (isSignUp) {
      if (!name) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      // For Student or Guardian, check if email exists in students collection
      if (role === 'Student') {
        const found = students.find((s) => s.parentEmail === email || s.rollNo === email || s.name === name);
        if (!found) {
          setError('No student found with this email or name.');
          setLoading(false);
          return;
        }
      }
      if (role === 'Guardian') {
        const found = students.find((s) => s.parentEmail === email);
        if (!found) {
          setError('No parent found with this email.');
          setLoading(false);
          return;
        }
      }
      const success = await signup(email, password, name, role);
      if (!success) {
        setError('Sign up failed. Try again.');
      } else {
        window.location.reload();
      }
    } else {
      const success = await login(email, password);
      if (!success) setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const success = await loginWithGoogle();
    if (!success) setError('Google sign in failed.');
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center mb-2 w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">LearnShield</span>
          <span className="mt-1 text-sm text-gray-500">Multi-Role Student Risk Dashboard</span>
        </div>
        <h2 className="mb-6 text-xl font-bold text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-l-lg border ${!isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r-lg border ${isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={e => setRole(e.target.value as typeof role)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-xs text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className='w-5 h-5' viewBox="0 0 256 262" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
            <g>
              <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4"/>
              <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853"/>
              <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05"/>
              <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335"/>
            </g>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
