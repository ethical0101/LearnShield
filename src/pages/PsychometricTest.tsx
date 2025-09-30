import React, { useState } from 'react';
import { Brain, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, FileText, TrendingDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface TestQuestion {
  id: number;
  category: 'academic' | 'family' | 'social' | 'emotional';
  question: string;
  options: { value: number; text: string }[];
}

interface TestResult {
  totalScore: number;
  categoryScores: {
    academic: number;
    family: number;
    social: number;
    emotional: number;
  };
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendations: string[];
  timestamp: Date;
}

const psychometricQuestions: TestQuestion[] = [
  // Academic Stress Questions
  {
    id: 1,
    category: 'academic',
    question: 'How often do you feel overwhelmed by your academic workload?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 2,
    category: 'academic',
    question: 'How often do you have trouble concentrating during classes or while studying?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 3,
    category: 'academic',
    question: 'How often do you feel like giving up on your studies?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 4,
    category: 'academic',
    question: 'How often do you worry about disappointing your teachers or mentors?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 5,
    category: 'academic',
    question: 'How often do you feel that your academic performance defines your worth?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },

  // Family-related Questions
  {
    id: 6,
    category: 'family',
    question: 'How often do you feel pressure from your family regarding your academic performance?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 7,
    category: 'family',
    question: 'How often do you worry about your family\'s financial situation affecting your education?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 8,
    category: 'family',
    question: 'How often do you feel like you cannot discuss your problems with your family?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 9,
    category: 'family',
    question: 'How often do you feel guilty about the money your family spends on your education?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },

  // Social Questions
  {
    id: 10,
    category: 'social',
    question: 'How often do you feel isolated or alone among your peers?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 11,
    category: 'social',
    question: 'How often do you avoid social activities because of academic stress?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 12,
    category: 'social',
    question: 'How often do you feel like others are judging your academic performance?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },

  // Emotional Well-being Questions
  {
    id: 13,
    category: 'emotional',
    question: 'How often do you feel sad or hopeless about your future?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 14,
    category: 'emotional',
    question: 'How often do you have trouble sleeping due to worry or stress?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 15,
    category: 'emotional',
    question: 'How often do you feel tired or lack energy even after resting?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 16,
    category: 'emotional',
    question: 'How often do you lose interest in activities you used to enjoy?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 17,
    category: 'emotional',
    question: 'How often do you have thoughts of not wanting to continue your education?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  },
  {
    id: 18,
    category: 'emotional',
    question: 'How often do you feel like you are not good enough despite your achievements?',
    options: [
      { value: 0, text: 'Never' },
      { value: 1, text: 'Rarely' },
      { value: 2, text: 'Sometimes' },
      { value: 3, text: 'Often' },
      { value: 4, text: 'Always' }
    ]
  }
];

export function PsychometricTest() {
  const { user } = useAuth();
  const { students } = useData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const calculateResult = (): TestResult => {
    const categoryScores = {
      academic: 0,
      family: 0,
      social: 0,
      emotional: 0
    };

    let totalScore = 0;

    psychometricQuestions.forEach(question => {
      const answer = answers[question.id] || 0;
      categoryScores[question.category] += answer;
      totalScore += answer;
    });

    // Calculate risk level based on total score (max possible: 72)
    let riskLevel: TestResult['riskLevel'];
    if (totalScore <= 18) riskLevel = 'Low';
    else if (totalScore <= 36) riskLevel = 'Moderate';
    else if (totalScore <= 54) riskLevel = 'High';
    else riskLevel = 'Severe';

    // Generate recommendations based on category scores and risk level
    const recommendations: string[] = [];

    if (categoryScores.academic >= 12) {
      recommendations.push('Consider academic counseling and study skills workshops');
      recommendations.push('Explore time management and stress reduction techniques');
    }

    if (categoryScores.family >= 8) {
      recommendations.push('Family counseling sessions may be beneficial');
      recommendations.push('Consider financial aid counseling if applicable');
    }

    if (categoryScores.social >= 6) {
      recommendations.push('Participate in peer support groups or social activities');
      recommendations.push('Consider joining study groups or clubs');
    }

    if (categoryScores.emotional >= 12) {
      recommendations.push('Professional mental health counseling is recommended');
      recommendations.push('Consider mindfulness and stress management programs');
    }

    if (riskLevel === 'High' || riskLevel === 'Severe') {
      recommendations.push('Immediate intervention and support is recommended');
      recommendations.push('Contact student counseling services');
    }

    return {
      totalScore,
      categoryScores,
      riskLevel,
      recommendations,
      timestamp: new Date()
    };
  };

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [psychometricQuestions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < psychometricQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const result = calculateResult();
      setTestResult(result);
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestResult(null);
    setIsCompleted(false);
    setShowInstructions(true);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      case 'Moderate': return <Clock className="w-5 h-5" />;
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      case 'Severe': return <TrendingDown className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (user?.role !== 'Student') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600">This psychometric test is only available for students.</p>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mental Health Assessment</h1>
              <p className="text-gray-600 mt-1">
                A comprehensive evaluation of your academic and emotional well-being
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Purpose</h3>
                <p className="text-sm">This assessment helps identify potential mental health concerns related to academic stress, family pressure, and emotional well-being that could impact your educational journey.</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Duration</h3>
                <p className="text-sm">The test contains 18 questions and typically takes 5-10 minutes to complete.</p>
              </div>
            </div>

            <div className="flex items-start">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Categories Assessed</h3>
                <ul className="text-sm space-y-1">
                  <li>• Academic stress and performance anxiety</li>
                  <li>• Family-related pressures and concerns</li>
                  <li>• Social relationships and peer interactions</li>
                  <li>• Emotional well-being and mental health</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Important Notes</h3>
                <ul className="text-sm space-y-1">
                  <li>• Answer honestly based on how you've been feeling recently</li>
                  <li>• This is not a diagnostic tool but a screening assessment</li>
                  <li>• Your responses are confidential and used only for support purposes</li>
                  <li>• If you're experiencing severe distress, please seek immediate help</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Confidentiality & Support</h4>
                <p className="text-blue-800 text-sm">
                  Your test results will be used to provide personalized recommendations and connect you with appropriate support resources. 
                  If high-risk indicators are detected, your mentor and counseling services will be notified to ensure you receive proper support.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowInstructions(false)}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg mr-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
                <p className="text-gray-600 mt-1">
                  Completed on {testResult.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={resetTest}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Retake Test
            </button>
          </div>
        </div>

        {/* Overall Risk Level */}
        <div className={`rounded-xl shadow-sm border p-6 ${getRiskColor(testResult.riskLevel)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getRiskIcon(testResult.riskLevel)}
              <div className="ml-3">
                <h2 className="text-xl font-bold">Risk Level: {testResult.riskLevel}</h2>
                <p className="text-sm opacity-90">
                  Total Score: {testResult.totalScore} / 72
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Academic Stress</h3>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {testResult.categoryScores.academic}
            </div>
            <div className="text-sm text-gray-500">out of 20</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(testResult.categoryScores.academic / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Family Pressure</h3>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {testResult.categoryScores.family}
            </div>
            <div className="text-sm text-gray-500">out of 16</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(testResult.categoryScores.family / 16) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Social Issues</h3>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {testResult.categoryScores.social}
            </div>
            <div className="text-sm text-gray-500">out of 12</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(testResult.categoryScores.social / 12) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Emotional Health</h3>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {testResult.categoryScores.emotional}
            </div>
            <div className="text-sm text-gray-500">out of 24</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${(testResult.categoryScores.emotional / 24) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
          <div className="space-y-3">
            {testResult.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Resources */}
        {(testResult.riskLevel === 'High' || testResult.riskLevel === 'Severe') && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Immediate Support Available</h3>
                <p className="text-red-800 mb-4">
                  Your assessment indicates you may benefit from immediate professional support. Please don't hesitate to reach out.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-red-800">
                    <span className="font-medium mr-2">Campus Counseling:</span>
                    <span>+91-XXX-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center text-red-800">
                    <span className="font-medium mr-2">24/7 Helpline:</span>
                    <span>1800-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center text-red-800">
                    <span className="font-medium mr-2">Emergency:</span>
                    <span>Call 102 or visit nearest hospital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const question = psychometricQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / psychometricQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mental Health Assessment</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {psychometricQuestions.length}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">{Math.round(progress)}% Complete</div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg mr-3 ${
              question.category === 'academic' ? 'bg-blue-50 text-blue-600' :
              question.category === 'family' ? 'bg-green-50 text-green-600' :
              question.category === 'social' ? 'bg-purple-50 text-purple-600' :
              'bg-orange-50 text-orange-600'
            }`}>
              <Brain className="w-5 h-5" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              question.category === 'academic' ? 'bg-blue-100 text-blue-800' :
              question.category === 'family' ? 'bg-green-100 text-green-800' :
              question.category === 'social' ? 'bg-purple-100 text-purple-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[question.id] === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={() => handleAnswer(option.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                answers[question.id] === option.value
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {answers[question.id] === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={answers[question.id] === undefined}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === psychometricQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}