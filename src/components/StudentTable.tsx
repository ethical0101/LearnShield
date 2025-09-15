import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Shield, TrendingUp, Eye } from 'lucide-react';

export function StudentTable() {
  const { students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || student.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [students, searchTerm, riskFilter]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Medium Risk':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'Safe':
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium Risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Safe':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Students Overview</h2>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="All">All Risks</option>
                <option value="High Risk">High Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="Safe">Safe</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.rollNo} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.rollNo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.attendancePercentage.toFixed(1)}%
                    {student.flags.includes('Low Attendance') && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Low Attendance</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {student.classesAttended}/{student.totalClasses} classes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.averageScore.toFixed(1)}</div>
                  <div className={`text-xs capitalize ${
                    student.scoreTrend === 'improving' ? 'text-green-600' :
                    student.scoreTrend === 'declining' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {student.scoreTrend}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.feeStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.feeStatus}
                  </div>
                  {student.dueAmount > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Due: ₹{student.dueAmount.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeClass(student.riskLevel)}`}>
                    {getRiskIcon(student.riskLevel)}
                    <span className="ml-1">{student.riskLevel}</span>
                  </div>
                  {student.flags.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {student.flags.join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/students/${student.rollNo}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No students found matching your criteria.</div>
        </div>
      )}
    </div>
  );
}
