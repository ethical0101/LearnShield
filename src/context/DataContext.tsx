import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Thresholds } from '../types';

interface DataContextType {
  students: Student[];
  thresholds: Thresholds;
  updateStudents: (students: Student[]) => void;
  updateThresholds: (thresholds: Thresholds) => void;
  calculateRisk: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

const defaultThresholds: Thresholds = {
  attendanceThreshold: 75,
  scoreThreshold: 40,
  feeThreshold: 2000,
};

// Mock student data
const mockStudents: Student[] = [
  {
    rollNo: 'STU001',
    name: 'Alice Johnson',
    classesAttended: 18,
    totalClasses: 20,
    attendancePercentage: 90,
    test1: 85,
    test2: 78,
    test3: 82,
    averageScore: 81.7,
    scoreTrend: 'stable',
    feeStatus: 'Paid',
    dueAmount: 0,
    parentName: 'Parent Smith',
    parentEmail: 'parent@edu.com',
    parentPhone: '+1234567890',
    riskLevel: 'Safe',
    flags: []
  },
  {
    rollNo: 'STU002',
    name: 'Bob Wilson',
    classesAttended: 12,
    totalClasses: 20,
    attendancePercentage: 60,
    test1: 45,
    test2: 38,
    test3: 42,
    averageScore: 41.7,
    scoreTrend: 'declining',
    feeStatus: 'Pending',
    dueAmount: 1500,
    parentName: 'Mary Wilson',
    parentEmail: 'mary@edu.com',
    parentPhone: '+1234567891',
    riskLevel: 'High Risk',
    flags: ['Low Attendance', 'Low Scores']
  },
  {
    rollNo: 'STU003',
    name: 'Carol Davis',
    classesAttended: 15,
    totalClasses: 20,
    attendancePercentage: 75,
    test1: 25,
    test2: 30,
    test3: 28,
    averageScore: 27.7,
    scoreTrend: 'improving',
    feeStatus: 'Pending',
    dueAmount: 3000,
    parentName: 'John Davis',
    parentEmail: 'john@edu.com',
    parentPhone: '+1234567892',
    riskLevel: 'High Risk',
    flags: ['Low Scores', 'High Fee Due']
  },
  {
    rollNo: 'STU004',
    name: 'David Brown',
    classesAttended: 14,
    totalClasses: 20,
    attendancePercentage: 70,
    test1: 65,
    test2: 70,
    test3: 68,
    averageScore: 67.7,
    scoreTrend: 'improving',
    feeStatus: 'Paid',
    dueAmount: 0,
    parentName: 'Lisa Brown',
    parentEmail: 'lisa@edu.com',
    parentPhone: '+1234567893',
    riskLevel: 'Medium Risk',
    flags: ['Low Attendance']
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [thresholds, setThresholds] = useState<Thresholds>(defaultThresholds);

  useEffect(() => {
    const savedStudents = localStorage.getItem('LearnShield_students');
    const savedThresholds = localStorage.getItem('LearnShield_thresholds');

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
    }
  }, []);

  const calculateRisk = () => {
    const updatedStudents = students.map(student => {
      const flags: string[] = [];

      if (student.attendancePercentage < thresholds.attendanceThreshold) {
        flags.push('Low Attendance');
      }
      if (student.averageScore < thresholds.scoreThreshold) {
        flags.push('Low Scores');
      }
      if (student.dueAmount > thresholds.feeThreshold) {
        flags.push('High Fee Due');
      }

      let riskLevel: Student['riskLevel'] = 'Safe';
      if (flags.length > 1) {
        riskLevel = 'High Risk';
      } else if (flags.length === 1) {
        riskLevel = 'Medium Risk';
      }

      return { ...student, flags, riskLevel };
    });

    setStudents(updatedStudents);
    localStorage.setItem('LearnShield_students', JSON.stringify(updatedStudents));
  };

  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('LearnShield_students', JSON.stringify(newStudents));
  };

  const updateThresholds = (newThresholds: Thresholds) => {
    setThresholds(newThresholds);
    localStorage.setItem('LearnShield_thresholds', JSON.stringify(newThresholds));
  };

  useEffect(() => {
    calculateRisk();
  }, [thresholds]);

  return (
    <DataContext.Provider value={{
      students,
      thresholds,
      updateStudents,
      updateThresholds,
      calculateRisk
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
