export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  maxScore: number;
  dueDate: string;
  rubric: RubricItem[];
  createdBy: string; // lecturer ID
}

export interface RubricItem {
  criteria: string;
  maxScore: number;
  weight: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentId: string;
  answer: string;
  submittedAt: string;
  wordCount: number;
  typingTime: number;
  pasteAttempts: number;
}

export interface GradingResult {
  submissionId: string;
  totalScore: number;
  maxScore: number;
  grade: string;
  criteriaScores: CriteriaScore[];
  feedback: string;
  strengths: string[];
  improvements: string[];
  aiConfidence: number;
  integrityScore: number;
}

export interface CriteriaScore {
  criteria: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'lecturer' | 'student';
  nim?: string; // for students
  nip?: string; // for lecturers
  department: string;
  createdAt: string;
}

export type AppView = 'login' | 'register' | 'dashboard' | 'submit' | 'results' | 'detail' | 'lecturer-students' | 'lecturer-analytics';
