export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  maxScore: number;
  dueDate: string;
  rubric: RubricItem[];
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

export type AppView = 'dashboard' | 'assignments' | 'submit' | 'results' | 'detail';
