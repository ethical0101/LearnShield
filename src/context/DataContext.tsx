import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Thresholds } from '../types';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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

// Students will be loaded from Firestore after upload
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>(defaultThresholds);

  // Fetch students from Firestore on mount and provide a manual refresh function
  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, 'students'));
    const studentsData: Student[] = snapshot.docs.map(doc => doc.data() as Student);
    setStudents(studentsData);
    setTimeout(() => calculateRisk(), 0);
  };

  useEffect(() => {
    fetchStudents();
    const savedThresholds = localStorage.getItem('LearnShield_thresholds');
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
      setTimeout(() => calculateRisk(), 0);
    }
  }, []);

  // Expose fetchStudents for manual refresh (can be used in dashboard/pages)

  // Calculate risk after fetching students and updating thresholds
  useEffect(() => {
    async function fetchStudents() {
      const snapshot = await getDocs(collection(db, 'students'));
      const studentsData: Student[] = snapshot.docs.map(doc => doc.data() as Student);
      setStudents(studentsData);
      // Calculate risk after students are fetched
      setTimeout(() => calculateRisk(), 0);
    }
    fetchStudents();
    const savedThresholds = localStorage.getItem('LearnShield_thresholds');
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
      // Calculate risk after thresholds are updated
      setTimeout(() => calculateRisk(), 0);
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
    // Recalculate risk after updating students
    // calculateRisk(); // Not needed, handled by useEffect above
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
      calculateRisk,
      fetchStudents // manual refresh
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
