// Core data types
export interface Student {
  rollNo: string;
  name: string;
  classesAttended: number;
  totalClasses: number;
  attendancePercentage: number;
  test1: number;
  test2: number;
  test3: number;
  averageScore: number;
  scoreTrend: 'improving' | 'declining' | 'stable';
  feeStatus: 'Paid' | 'Pending';
  dueAmount: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Safe';
  flags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Mentor' | 'Guardian' | 'Student';
  rollNo?: string; // For students and guardians
}

export interface Thresholds {
  attendanceThreshold: number;
  scoreThreshold: number;
  feeThreshold: number;
}

export interface UploadData {
  attendance: AttendanceData[];
  scores: ScoresData[];
  fees: FeesData[];
  guardians: GuardiansData[];
}

export interface AttendanceData {
  rollNo: string;
  name: string;
  classesAttended: number;
  totalClasses: number;
  attendancePercentage: number;
}

export interface ScoresData {
  rollNo: string;
  test1: number;
  test2: number;
  test3: number;
  average: number;
  trend: string;
}

export interface FeesData {
  rollNo: string;
  feeStatus: string;
  dueAmount: number;
}

export interface GuardiansData {
  rollNo: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}