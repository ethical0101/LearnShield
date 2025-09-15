import React from 'react';
import { AttendanceData, ScoresData, FeesData, GuardiansData } from '../types';

interface DataPreviewProps {
  data: {
    attendance: AttendanceData[];
    scores: ScoresData[];
    fees: FeesData[];
    guardians: GuardiansData[];
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function DataPreview({ data, onConfirm, onCancel }: DataPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Data Preview</h2>
        <p className="text-gray-600 mt-2">Review the uploaded data before saving to database</p>
      </div>

      {/* Attendance Preview */}
      {data.attendance.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Data ({data.attendance.length} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Classes Attended</th>
                  <th className="px-4 py-2 text-left">Total Classes</th>
                  <th className="px-4 py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.attendance.slice(0, 3).map((record, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{record.rollNo}</td>
                    <td className="px-4 py-2">{record.name}</td>
                    <td className="px-4 py-2">{record.classesAttended}</td>
                    <td className="px-4 py-2">{record.totalClasses}</td>
                    <td className="px-4 py-2">{record.attendancePercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.attendance.length > 3 && (
              <p className="text-gray-500 text-center mt-2">
                ... and {data.attendance.length - 3} more records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Scores Preview */}
      {data.scores.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Scores Data ({data.scores.length} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Test 1</th>
                  <th className="px-4 py-2 text-left">Test 2</th>
                  <th className="px-4 py-2 text-left">Test 3</th>
                  <th className="px-4 py-2 text-left">Average</th>
                  <th className="px-4 py-2 text-left">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.scores.slice(0, 3).map((record, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{record.rollNo}</td>
                    <td className="px-4 py-2">{record.test1}</td>
                    <td className="px-4 py-2">{record.test2}</td>
                    <td className="px-4 py-2">{record.test3}</td>
                    <td className="px-4 py-2">{record.average}</td>
                    <td className="px-4 py-2 capitalize">{record.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.scores.length > 3 && (
              <p className="text-gray-500 text-center mt-2">
                ... and {data.scores.length - 3} more records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm and Save
        </button>
      </div>
    </div>
  );
}