import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart3, Download, TrendingUp, AlertTriangle, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Reports() {
  const { students, thresholds } = useData();

  // Calculate statistics
  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskLevel === 'High Risk').length;
  const mediumRiskStudents = students.filter(s => s.riskLevel === 'Medium Risk').length;
  const safeStudents = students.filter(s => s.riskLevel === 'Safe').length;

  const averageAttendance = students.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents || 0;
  const averageScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents || 0;
  const totalFeesDue = students.reduce((sum, s) => sum + s.dueAmount, 0);

  // Chart data
  const riskTrendData = [
    { month: 'Jan', highRisk: 2, mediumRisk: 3, safe: 15 },
    { month: 'Feb', highRisk: 3, mediumRisk: 4, safe: 13 },
    { month: 'Mar', highRisk: highRiskStudents, mediumRisk: mediumRiskStudents, safe: safeStudents }
  ];

  const performanceData = [
    { category: 'Attendance', value: averageAttendance, threshold: thresholds.attendanceThreshold },
    { category: 'Scores', value: averageScore, threshold: thresholds.scoreThreshold },
    { category: 'Fee Collection', value: ((totalStudents - students.filter(s => s.dueAmount > 0).length) / totalStudents) * 100, threshold: 90 }
  ];

  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
      const csvContent = [
        ['Roll No', 'Name', 'Attendance %', 'Average Score', 'Fee Status', 'Due Amount', 'Risk Level', 'Flags'].join(','),
        ...students.map(s => [
          s.rollNo,
          s.name,
          s.attendancePercentage,
          s.averageScore,
          s.feeStatus,
          s.dueAmount,
          s.riskLevel,
          s.flags.join('; ')
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_risk_report.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into student performance and risk trends
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            <div className="text-xs text-gray-500 mt-1">Active enrollments</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-700">
              {Math.round((highRiskStudents / totalStudents) * 100)}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">High Risk Students</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{highRiskStudents}</p>
            <div className="text-xs text-gray-500 mt-1">Require immediate attention</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Avg. Attendance</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{averageAttendance.toFixed(1)}%</p>
            <div className={`text-xs mt-1 ${
              averageAttendance >= thresholds.attendanceThreshold ? 'text-green-600' : 'text-red-600'
            }`}>
              Threshold: {thresholds.attendanceThreshold}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Avg. Score</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{averageScore.toFixed(1)}</p>
            <div className={`text-xs mt-1 ${
              averageScore >= thresholds.scoreThreshold ? 'text-green-600' : 'text-red-600'
            }`}>
              Threshold: {thresholds.scoreThreshold}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="highRisk" stroke="#EF4444" name="High Risk" strokeWidth={3} />
              <Line type="monotone" dataKey="mediumRisk" stroke="#F59E0B" name="Medium Risk" strokeWidth={3} />
              <Line type="monotone" dataKey="safe" stroke="#10B981" name="Safe" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance vs Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Thresholds</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" name="Actual" radius={[4, 4, 0, 0]} />
              <Bar dataKey="threshold" fill="#EF4444" name="Threshold" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Analysis Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Attendance Issues</h4>
            <div className="space-y-2">
              {students.filter(s => s.flags.includes('Low Attendance')).map(student => (
                <div key={student.rollNo} className="flex justify-between text-sm">
                  <span>{student.name}</span>
                  <span className="text-red-600">{student.attendancePercentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Academic Concerns</h4>
            <div className="space-y-2">
              {students.filter(s => s.flags.includes('Low Scores')).map(student => (
                <div key={student.rollNo} className="flex justify-between text-sm">
                  <span>{student.name}</span>
                  <span className="text-red-600">{student.averageScore.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Fee Defaults</h4>
            <div className="space-y-2">
              {students.filter(s => s.flags.includes('High Fee Due')).map(student => (
                <div key={student.rollNo} className="flex justify-between text-sm">
                  <span>{student.name}</span>
                  <span className="text-red-600">₹{student.dueAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}