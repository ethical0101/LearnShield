import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Upload } from './pages/Upload';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { AIInsights } from './pages/AIInsights';
import { StudentDetails } from './pages/StudentDetails';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin and Mentor routes */}
        {(user?.role === 'Admin' || user?.role === 'Mentor') && (
          <>
            <Route path="/students" element={<Students />} />
            <Route path="/students/:rollNo" element={<StudentDetails />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-insights" element={<AIInsights />} />
          </>
        )}

        {/* Guardian routes */}
        {user?.role === 'Guardian' && (
          <>
            <Route path="/student-profile" element={<StudentDetails />} />
          </>
        )}

        {/* Student routes */}
        {user?.role === 'Student' && (
          <>
            <Route path="/my-profile" element={<StudentDetails />} />
          </>
        )}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
