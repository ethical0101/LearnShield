import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { AttendanceData, ScoresData, FeesData, GuardiansData, Student } from '../types';
import { useData } from '../context/DataContext';
import { db } from '../firebase';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

interface UploadZoneProps {
  onDataUploaded: (data: {
    attendance: AttendanceData[];
    scores: ScoresData[];
    fees: FeesData[];
    guardians: GuardiansData[];
  }) => void;
}

export function UploadZone({ onDataUploaded }: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
    attendance: File | null;
    scores: File | null;
    fees: File | null;
    guardians: File | null;
  }>({
    attendance: null,
    scores: null,
    fees: null,
    guardians: null
  });

  const [parsedData, setParsedData] = useState<{
    attendance: AttendanceData[];
    scores: ScoresData[];
    fees: FeesData[];
    guardians: GuardiansData[];
  }>({
    attendance: [],
    scores: [],
    fees: [],
    guardians: []
  });

  const [errors, setErrors] = useState<string[]>([]);
  const { updateStudents } = useData();

  const handleFileUpload = useCallback((type: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          let processedData: AttendanceData[] | ScoresData[] | FeesData[] | GuardiansData[] = [];
          switch (type) {
            case 'attendance':
              processedData = (results.data as Record<string, string>[])
                .filter(row => row['rollNo'] && row['rollNo'].trim() !== '')
                .map((row) => ({
                  rollNo: row['rollNo'],
                  name: row['name'] || '',
                  classesAttended: parseInt(row['classesAttended'] || '0'),
                  totalClasses: parseInt(row['totalClasses'] || '0'),
                  attendancePercentage: parseFloat(row['attendancePercentage'] || '0')
                }));
              break;
            case 'scores':
              processedData = (results.data as Record<string, string>[])
                .filter(row => row['rollNo'] && row['rollNo'].trim() !== '')
                .map((row) => ({
                  rollNo: row['rollNo'],
                  test1: parseFloat(row['test1'] || '0'),
                  test2: parseFloat(row['test2'] || '0'),
                  test3: parseFloat(row['test3'] || '0'),
                  average: parseFloat(row['average'] || '0'),
                  trend: row['trend'] || 'stable'
                }));
              break;
            case 'fees':
              processedData = (results.data as Record<string, string>[])
                .filter(row => row['rollNo'] && row['rollNo'].trim() !== '')
                .map((row) => ({
                  rollNo: row['rollNo'],
                  feeStatus: row['feeStatus'] || 'Paid',
                  dueAmount: parseFloat(row['dueAmount'] || '0')
                }));
              break;
            case 'guardians':
              processedData = (results.data as Record<string, string>[])
                .filter(row => row['rollNo'] && row['rollNo'].trim() !== '')
                .map((row) => ({
                  rollNo: row['rollNo'],
                  parentName: row['parentName'] || '',
                  parentEmail: row['parentEmail'] || '',
                  parentPhone: row['parentPhone'] || ''
                }));
              break;
            default:
              processedData = [];
          }
          setParsedData(prev => ({ ...prev, [type]: processedData }));
          setErrors([]);
        } catch (error) {
          setErrors([`Error parsing ${type} file: ${error}`]);
        }
      },
      error: (error) => {
        setErrors([`Error reading ${type} file: ${error.message}`]);
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (Object.values(uploadedFiles).every(file => file !== null)) {
      // Delete all existing students in Firestore
      const existing = await getDocs(collection(db, 'students'));
      for (const docSnap of existing.docs) {
        await deleteDoc(doc(db, 'students', docSnap.id));
      }
      // Merge all parsed data into Student[]
      const attendanceMap = new Map(parsedData.attendance.map((a) => [a.rollNo, a]));
      const scoresMap = new Map(parsedData.scores.map((s) => [s.rollNo, s]));
      const feesMap = new Map(parsedData.fees.map((f) => [f.rollNo, f]));
      const guardiansMap = new Map(parsedData.guardians.map((g) => [g.rollNo, g]));
      const rollNos = Array.from(new Set([
        ...parsedData.attendance.map((a) => a.rollNo),
        ...parsedData.scores.map((s) => s.rollNo),
        ...parsedData.fees.map((f) => f.rollNo),
        ...parsedData.guardians.map((g) => g.rollNo)
      ]));
      const students: Student[] = rollNos.map(rollNo => {
        const att = attendanceMap.get(rollNo) as AttendanceData || {} as AttendanceData;
        const sc = scoresMap.get(rollNo) as ScoresData || {} as ScoresData;
        const fee = feesMap.get(rollNo) as FeesData || {} as FeesData;
        const guard = guardiansMap.get(rollNo) as GuardiansData || {} as GuardiansData;
        // Only allow valid scoreTrend values
        let scoreTrend: 'improving' | 'declining' | 'stable' = 'stable';
        if (sc.trend === 'improving' || sc.trend === 'declining' || sc.trend === 'stable') {
          scoreTrend = sc.trend;
        }
        // Only allow valid feeStatus values
        let feeStatus: 'Paid' | 'Pending' = 'Paid';
        if (fee.feeStatus === 'Paid' || fee.feeStatus === 'Pending') {
          feeStatus = fee.feeStatus;
        }
        return {
          rollNo,
          name: att.name || '',
          classesAttended: att.classesAttended || 0,
          totalClasses: att.totalClasses || 0,
          attendancePercentage: att.attendancePercentage || 0,
          test1: sc.test1 || 0,
          test2: sc.test2 || 0,
          test3: sc.test3 || 0,
          averageScore: sc.average || 0,
          scoreTrend,
          feeStatus,
          dueAmount: fee.dueAmount || 0,
          parentName: guard.parentName || '',
          parentEmail: guard.parentEmail || '',
          parentPhone: guard.parentPhone || '',
          riskLevel: 'Safe',
          flags: []
        };
      });
      // Save each student to Firestore
      for (const student of students) {
        await setDoc(doc(db, 'students', student.rollNo), student);
      }
      updateStudents(students);
      onDataUploaded(parsedData); // If you still want to use this prop
    }
  };

  const fileTypes = [
    { key: 'attendance' as const, label: 'Attendance Data', description: 'Roll No, Name, Classes Attended, Total Classes, % Attendance' },
    { key: 'scores' as const, label: 'Scores Data', description: 'Roll No, Test1, Test2, Test3, Average, Trend' },
    { key: 'fees' as const, label: 'Fees Data', description: 'Roll No, Fee Status, Due Amount' },
    { key: 'guardians' as const, label: 'Guardians Data', description: 'Roll No, Parent Name, Parent Email, Parent Phone' }
  ];

  return (
    <div className="space-y-6">
      {/* Upload Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fileTypes.map(({ key, label, description }) => (
          <div key={key} className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
              {uploadedFiles[key] ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Upload className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <p className="mb-4 text-sm text-gray-600">{description}</p>

            <div className="p-4 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(key, e.target.files[0]);
                  }
                }}
                className="hidden"
                id={`file-${key}`}
              />
              <label
                htmlFor={`file-${key}`}
                className="flex flex-col items-center cursor-pointer"
              >
                <FileText className="w-8 h-8 mb-2 text-gray-400" />
                {uploadedFiles[key] ? (
                  <div className="text-sm">
                    <span className="font-medium text-green-600">{uploadedFiles[key]?.name}</span>
                    <br />
                    <span className="text-gray-500">Click to replace</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Click to upload CSV file
                  </div>
                )}
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            <h4 className="font-medium text-red-800">Upload Errors</h4>
          </div>
          <ul className="space-y-1 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!Object.values(uploadedFiles).every(file => file !== null)}
          className="px-8 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Process and Upload Data
        </button>
      </div>
    </div>
  );
}
