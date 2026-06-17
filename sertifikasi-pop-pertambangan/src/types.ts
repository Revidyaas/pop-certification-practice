// Types definitions for the POP Pertambangan AI Prep Platform

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: "student" | "instructor" | "admin";
}

export interface ModuleItem {
  id: string; // "modul-1", "modul-2", etc.
  title: string;
  category: string;
  description: string;
  ringkasan: string;
  materiDetail: string[];
  casestudy: {
    title: string;
    description: string;
    question: string;
    guide: string;
  };
  keyRegulations: string[];
}

export interface RubricScores {
  keselamatan: number;
  regulasi: number;
  keputusan: number;
  risiko: number;
  kepemimpinan: number;
  komunikasi: number;
}

export interface AssessmentRecord {
  assessmentId: string;
  userId: string;
  moduleTitle: string;
  status: "active" | "completed";
  scenario: string;
  answers: string[]; // Answers submitted by candidate
  questions: string[]; // Dynamic questions posed
  rubricScores?: RubricScores;
  scoreTotal?: number;
  level?: "Belum Kompeten" | "Cukup Kompeten" | "Kompeten" | "Sangat Kompeten";
  kelebihan?: string[];
  kekurangan?: string[];
  perspektif?: string;
  contohIdeal?: string;
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  module: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ExamRecord {
  examId: string;
  userId: string;
  score: number;
  competencyLevel: string;
  responses: Array<{
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
