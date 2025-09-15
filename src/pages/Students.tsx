import React from 'react';
import { StudentTable } from '../components/StudentTable';
import { useData } from '../context/DataContext';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';

export function Students() {
  const { students } = useData();

  const highRiskCount = students.filter(s => s.riskLevel === 'High Risk').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'Medium Risk').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor and track student performance and risk levels
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {(highRiskCount > 0 || mediumRiskCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highRiskCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <div className="text-red-800 font-medium">
                    {highRiskCount} High Risk Students
                  </div>
                  <div className="text-red-600 text-sm">
                    Require immediate attention
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {mediumRiskCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <div className="text-yellow-800 font-medium">
                    {mediumRiskCount} Medium Risk Students
                  </div>
                  <div className="text-yellow-600 text-sm">
                    Monitor closely
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Students Table */}
      <StudentTable />
    </div>
  );
}