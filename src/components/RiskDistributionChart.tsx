import React from 'react';
import { useData } from '../context/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function RiskDistributionChart() {
  const { students } = useData();

  const riskData = [
    {
      name: 'High Risk',
      value: students.filter(s => s.riskLevel === 'High Risk').length,
      color: '#EF4444'
    },
    {
      name: 'Medium Risk',
      value: students.filter(s => s.riskLevel === 'Medium Risk').length,
      color: '#F59E0B'
    },
    {
      name: 'Safe',
      value: students.filter(s => s.riskLevel === 'Safe').length,
      color: '#10B981'
    }
  ];

  const attendanceData = [
    {
      range: '90-100%',
      count: students.filter(s => s.attendancePercentage >= 90).length
    },
    {
      range: '80-89%',
      count: students.filter(s => s.attendancePercentage >= 80 && s.attendancePercentage < 90).length
    },
    {
      range: '70-79%',
      count: students.filter(s => s.attendancePercentage >= 70 && s.attendancePercentage < 80).length
    },
    {
      range: '60-69%',
      count: students.filter(s => s.attendancePercentage >= 60 && s.attendancePercentage < 70).length
    },
    {
      range: 'Below 60%',
      count: students.filter(s => s.attendancePercentage < 60).length
    }
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Distribution Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}