import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, User, Mail, Phone, AlertTriangle, TrendingUp, Shield, Calendar, DollarSign, Heart, Brain } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function StudentDetails() {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const { students } = useData();

  const student = students.find(s => s.rollNo === rollNo);

  if (!student) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Student not found</div>
        <button
          onClick={() => navigate('/students')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Students
        </button>
      </div>
    );
  }

  // Mock score history for visualization
  const scoreHistory = [
    { test: 'Test 1', score: student.test1 },
    { test: 'Test 2', score: student.test2 },
    { test: 'Test 3', score: student.test3 }
  ];

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Medium Risk':
        return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'Safe':
        return <Shield className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getRiskColors = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Medium Risk':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Safe':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="p-4 bg-blue-50 rounded-xl mr-6">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600 mt-1">Roll No: {student.rollNo}</p>
              <div className="flex items-center mt-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColors(student.riskLevel)}`}>
                  {getRiskIcon(student.riskLevel)}
                  <span className="ml-2">{student.riskLevel}</span>
                </div>
              </div>
              {student.flags.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {student.flags.map((flag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Attendance</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {student.attendancePercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {student.classesAttended}/{student.totalClasses} classes attended
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {student.averageScore.toFixed(1)}
            </p>
            <p className={`text-sm mt-1 capitalize ${
              student.scoreTrend === 'improving' ? 'text-green-600' :
              student.scoreTrend === 'declining' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {student.scoreTrend} trend
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Fee Status</h3>
            <p className={`text-lg font-semibold mt-1 ${
              student.feeStatus === 'Paid' ? 'text-green-600' : 'text-red-600'
            }`}>
              {student.feeStatus}
            </p>
            {student.dueAmount > 0 && (
              <p className="text-sm text-red-600 mt-1">
                Due: ₹{student.dueAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Score Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Progression</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scoreHistory}>
            <XAxis dataKey="test" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Guardian Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{student.parentName}</p>
              <p className="text-xs text-gray-500">Parent/Guardian</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{student.parentEmail}</p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{student.parentPhone}</p>
              <p className="text-xs text-gray-500">Phone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Send Alert to Guardian
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Schedule Meeting
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Add Note
        </button>
      </div>
    </div>
  );
}