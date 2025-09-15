import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings as SettingsIcon, Save, AlertCircle } from 'lucide-react';

export function Settings() {
  const { thresholds, updateThresholds } = useData();
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateThresholds(localThresholds);
    setIsSaving(false);
    setSaved(true);
    
    // Reset saved status after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setLocalThresholds(thresholds);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg mr-4">
            <SettingsIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Threshold Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure risk detection parameters for student monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Threshold */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {localThresholds.attendanceThreshold}%
              </div>
              <div className="text-sm text-blue-600">Attendance Threshold</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Attendance Percentage
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={localThresholds.attendanceThreshold}
                onChange={(e) => setLocalThresholds(prev => ({
                  ...prev,
                  attendanceThreshold: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>95%</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Students below this attendance percentage will be flagged
              </p>
            </div>
          </div>

          {/* Score Threshold */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {localThresholds.scoreThreshold}
              </div>
              <div className="text-sm text-green-600">Score Threshold</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Average Score
              </label>
              <input
                type="range"
                min="20"
                max="70"
                step="5"
                value={localThresholds.scoreThreshold}
                onChange={(e) => setLocalThresholds(prev => ({
                  ...prev,
                  scoreThreshold: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20</span>
                <span>70</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Students below this average score will be flagged
              </p>
            </div>
          </div>

          {/* Fee Threshold */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">
                ₹{localThresholds.feeThreshold.toLocaleString()}
              </div>
              <div className="text-sm text-orange-600">Fee Due Threshold</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Fee Due Amount (₹)
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={localThresholds.feeThreshold}
                onChange={(e) => setLocalThresholds(prev => ({
                  ...prev,
                  feeThreshold: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Students with dues above this amount will be flagged
              </p>
            </div>
          </div>
        </div>

        {/* Risk Classification Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Risk Classification Rules</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li><span className="font-medium text-red-600">High Risk:</span> Students with more than one flag</li>
                <li><span className="font-medium text-yellow-600">Medium Risk:</span> Students with exactly one flag</li>
                <li><span className="font-medium text-green-600">Safe:</span> Students with no flags</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reset to Current
          </button>
          
          <div className="flex items-center gap-4">
            {saved && (
              <div className="flex items-center text-green-600 text-sm">
                <Save className="w-4 h-4 mr-1" />
                Settings saved successfully!
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}