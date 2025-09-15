import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { DataPreview } from '../components/DataPreview';
import { useData } from '../context/DataContext';
import { Student, AttendanceData, ScoresData, FeesData, GuardiansData } from '../types';
import { Upload as UploadIcon, Database, CheckCircle } from 'lucide-react';

export function Upload() {
  const { updateStudents, calculateRisk } = useData();
  const [uploadedData, setUploadedData] = useState<{
    attendance: AttendanceData[];
    scores: ScoresData[];
    fees: FeesData[];
    guardians: GuardiansData[];
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDataUploaded = (data: {
    attendance: AttendanceData[];
    scores: ScoresData[];
    fees: FeesData[];
    guardians: GuardiansData[];
  }) => {
    setUploadedData(data);
    setShowPreview(true);
  };

  const handleConfirm = async () => {
    if (!uploadedData) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Merge data by Roll No
    const mergedStudents: Student[] = [];
    const rollNumbers = new Set<string>();

    // Collect all unique roll numbers
    [...uploadedData.attendance, ...uploadedData.scores, ...uploadedData.fees, ...uploadedData.guardians]
      .forEach(record => rollNumbers.add(record.rollNo));

    // Create merged student records
    rollNumbers.forEach(rollNo => {
      const attendance = uploadedData.attendance.find(a => a.rollNo === rollNo);
      const scores = uploadedData.scores.find(s => s.rollNo === rollNo);
      const fees = uploadedData.fees.find(f => f.rollNo === rollNo);
      const guardian = uploadedData.guardians.find(g => g.rollNo === rollNo);

      const student: Student = {
        rollNo,
        name: attendance?.name || `Student ${rollNo}`,
        classesAttended: attendance?.classesAttended || 0,
        totalClasses: attendance?.totalClasses || 0,
        attendancePercentage: attendance?.attendancePercentage || 0,
        test1: scores?.test1 || 0,
        test2: scores?.test2 || 0,
        test3: scores?.test3 || 0,
        averageScore: scores?.average || 0,
        scoreTrend: (scores?.trend || 'stable') as 'improving' | 'declining' | 'stable',
        feeStatus: (fees?.feeStatus || 'Paid') as 'Paid' | 'Pending',
        dueAmount: fees?.dueAmount || 0,
        parentName: guardian?.parentName || '',
        parentEmail: guardian?.parentEmail || '',
        parentPhone: guardian?.parentPhone || '',
        riskLevel: 'Safe',
        flags: []
      };

      mergedStudents.push(student);
    });

    // Update students and calculate risk
    updateStudents(mergedStudents);
    calculateRisk();

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleCancel = () => {
    setUploadedData(null);
    setShowPreview(false);
  };

  const handleReset = () => {
    setUploadedData(null);
    setShowPreview(false);
    setIsComplete(false);
    setIsProcessing(false);
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Upload Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Student data has been successfully processed and saved to the database.
          </p>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload More Data
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Data...
          </h1>
          <p className="text-gray-600">
            Merging files and calculating risk levels. Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (showPreview && uploadedData) {
    return (
      <div className="max-w-6xl mx-auto">
        <DataPreview
          data={uploadedData}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <UploadIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Student Data</h1>
            <p className="text-gray-600 mt-1">
              Upload CSV files for attendance, scores, fees, and guardian information
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <Database className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Upload Instructions</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Upload all four CSV files: Attendance, Scores, Fees, and Guardians</li>
              <li>• Files will be automatically merged using Roll No as the primary key</li>
              <li>• Ensure Roll No format is consistent across all files</li>
              <li>• Risk levels will be calculated automatically based on configured thresholds</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone onDataUploaded={handleDataUploaded} />
    </div>
  );
}