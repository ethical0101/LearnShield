import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Upload,
  Settings,
  BarChart3,
  Brain,
  LogOut,
  User,
  Shield,
  UserCheck,
  GraduationCap,
  Heart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'text-purple-600';
      case 'Mentor': return 'text-blue-600';
      case 'Guardian': return 'text-green-600';
      case 'Student': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="w-5 h-5" />;
      case 'Mentor': return <UserCheck className="w-5 h-5" />;
      case 'Guardian': return <User className="w-5 h-5" />;
      case 'Student': return <GraduationCap className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ];

    if (user?.role === 'Admin' || user?.role === 'Mentor') {
      return [
        ...baseItems,
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/upload', icon: Upload, label: 'Upload Data' },
        { path: '/settings', icon: Settings, label: 'Settings' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/ai-insights', icon: Brain, label: 'AI Insights' }
      ];
    }

    if (user?.role === 'Guardian') {
      return [
        ...baseItems,
        { path: '/student-profile', icon: User, label: 'Student Profile' }
      ];
    }

    if (user?.role === 'Student') {
      return [
        ...baseItems,
        { path: '/my-profile', icon: User, label: 'My Profile' },
        { path: '/mental-health-test', icon: Heart, label: 'Mental Health Test' }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LearnShield</span>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-100 ${getRoleColor(user?.role || '')}`}>
                {getRoleIcon(user?.role || '')}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className={`text-xs ${getRoleColor(user?.role || '')}`}>{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4">
            <div className="space-y-2">
              {navigationItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="px-6 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
