import React, { useState } from 'react';
import { Brain, Lightbulb, TrendingUp, Users, MessageSquare, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export function AIInsights() {
  const { students, thresholds } = useData();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI insights based on data
  const generateInsights = () => {
    const highRiskCount = students.filter(s => s.riskLevel === 'High Risk').length;
    const lowAttendanceCount = students.filter(s => s.flags.includes('Low Attendance')).length;
    const lowScoresCount = students.filter(s => s.flags.includes('Low Scores')).length;
    const improvingStudents = students.filter(s => s.scoreTrend === 'improving').length;
    const decliningStudents = students.filter(s => s.scoreTrend === 'declining').length;

    return [
      {
        title: "Risk Distribution Analysis",
        content: `Currently ${highRiskCount} students (${Math.round((highRiskCount / students.length) * 100)}%) are classified as high risk. This is ${highRiskCount > 2 ? 'above' : 'within'} the recommended threshold for immediate intervention.`,
        type: "analysis",
        priority: highRiskCount > 2 ? "high" : "medium"
      },
      {
        title: "Attendance Pattern Insight",
        content: `${lowAttendanceCount} students have attendance below ${thresholds.attendanceThreshold}%. Consider implementing attendance monitoring strategies and reaching out to parents for these students.`,
        type: "recommendation",
        priority: "high"
      },
      {
        title: "Academic Performance Trend",
        content: `${improvingStudents} students show improving score trends while ${decliningStudents} show declining performance. Focus intervention resources on declining students while recognizing improving ones.`,
        type: "trend",
        priority: "medium"
      },
      {
        title: "Early Intervention Opportunity",
        content: "Students with medium risk can be prevented from becoming high risk through targeted mentoring and regular check-ins. Consider assigning mentors to these students.",
        type: "recommendation",
        priority: "medium"
      }
    ];
  };

  const handleAIQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI responses based on query
    const mockResponses = {
      "attendance": "Based on the current data, students with low attendance show a correlation with declining academic performance. I recommend implementing weekly check-ins for students below 70% attendance.",
      "scores": "The score analysis reveals that students with declining trends typically have attendance issues as well. Early intervention for students showing declining scores in 2 consecutive tests is recommended.",
      "risk": "High-risk students typically have multiple flags. Focus on addressing the primary issue first - usually attendance - as it often correlates with other problems.",
      "default": "Based on your student data, I recommend focusing on early intervention strategies. Students with medium risk have the highest potential for improvement with proper support."
    };
    
    const queryLower = query.toLowerCase();
    let response = mockResponses.default;
    
    if (queryLower.includes('attendance')) response = mockResponses.attendance;
    else if (queryLower.includes('score') || queryLower.includes('grade')) response = mockResponses.scores;
    else if (queryLower.includes('risk')) response = mockResponses.risk;
    
    setAiResponse(response);
    setIsLoading(false);
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <TrendingUp className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'trend': return <Users className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg mr-4">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Insights & Recommendations</h1>
            <p className="text-gray-600 mt-1">
              Intelligent analysis of student risk patterns and intervention strategies
            </p>
          </div>
        </div>
      </div>

      {/* AI Query Tool */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Ask AI Assistant</h3>
        </div>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about student performance, attendance patterns, or risk factors..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
          />
          <button
            onClick={handleAIQuery}
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Processing...' : 'Ask AI'}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">AI Response</h4>
                <p className="text-blue-800">{aiResponse}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`rounded-xl shadow-sm border p-6 ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-lg mr-3 ${getPriorityTextColor(insight.priority)}`}>
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${getPriorityTextColor(insight.priority)}`}>
                    {insight.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.priority === 'high' ? 'bg-red-200 text-red-800' :
                    insight.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {insight.priority} priority
                  </span>
                </div>
                <p className={`text-sm ${getPriorityTextColor(insight.priority)}`}>
                  {insight.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Schedule Interventions</span>
            </div>
            <p className="text-blue-700 text-sm">Set up meetings with high-risk students</p>
          </button>
          
          <button className="p-4 text-left border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Send Notifications</span>
            </div>
            <p className="text-green-700 text-sm">Alert guardians about student status</p>
          </button>
          
          <button className="p-4 text-left border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-900">Update Thresholds</span>
            </div>
            <p className="text-purple-700 text-sm">Adjust risk detection parameters</p>
          </button>
        </div>
      </div>
    </div>
  );
}