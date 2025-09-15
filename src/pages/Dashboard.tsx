import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RiskOverviewCards } from '../components/RiskOverviewCards';
import { StudentTable } from '../components/StudentTable';
import { RiskDistributionChart } from '../components/RiskDistributionChart';

export function Dashboard() {
  const { user } = useAuth();

  const getRoleGreeting = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'Welcome to your administrative dashboard';
      case 'Mentor':
        return 'Monitor your students and track their progress';
      case 'Guardian':
        return "View your child's academic progress and risk status";
      case 'Student':
        return 'Track your academic performance and goals';
      default:
        return 'Welcome to LearnShield';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-gray-600">
          {getRoleGreeting(user?.role || '')}
        </p>
      </div>

      {/* Overview Cards */}
      <RiskOverviewCards />

      {/* Charts */}
      <RiskDistributionChart />

      {/* Students Table (for Admin and Mentor roles) */}
      {(user?.role === 'Admin' || user?.role === 'Mentor') && (
        <StudentTable />
      )}

      {/* Student/Guardian specific content */}
      {(user?.role === 'Student' || user?.role === 'Guardian') && (
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {user?.role === 'Student' ? 'Your Performance' : "Your Child's Performance"}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 text-center rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-700">90%</div>
              <div className="text-sm text-blue-600">Attendance</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-700">81.7</div>
              <div className="text-sm text-green-600">Average Score</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-700">Safe</div>
              <div className="text-sm text-green-600">Risk Status</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
