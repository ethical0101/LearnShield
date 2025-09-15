import React from 'react';
import { useData } from '../context/DataContext';
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

export function RiskOverviewCards() {
  const { students } = useData();

  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskLevel === 'High Risk').length;
  const mediumRiskStudents = students.filter(s => s.riskLevel === 'Medium Risk').length;
  const safeStudents = students.filter(s => s.riskLevel === 'Safe').length;

  const cards = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700'
    },
    {
      title: 'High Risk',
      value: highRiskStudents,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
      percentage: totalStudents > 0 ? Math.round((highRiskStudents / totalStudents) * 100) : 0
    },
    {
      title: 'Medium Risk',
      value: mediumRiskStudents,
      icon: TrendingUp,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
      percentage: totalStudents > 0 ? Math.round((mediumRiskStudents / totalStudents) * 100) : 0
    },
    {
      title: 'Safe Students',
      value: safeStudents,
      icon: Shield,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
      percentage: totalStudents > 0 ? Math.round((safeStudents / totalStudents) * 100) : 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            {card.percentage !== undefined && (
              <span className={`text-sm font-medium ${card.textColor}`}>
                {card.percentage}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}