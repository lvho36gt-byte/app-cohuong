export type AppRole = 'student' | 'teacher' | 'admin';

export type SupportLevel = 'muc1' | 'muc2' | 'muc3';

export interface StudentCodeInfo {
  code: string;
  supportLevel: SupportLevel;
  joinedAt: string;
}

export interface StudentClass {
  id: string;
  name: string;
  academicYear: string;
  teacherName: string;
  studentCodes: StudentCodeInfo[];
}

export interface LearningMaterial {
  id: string;
  title: string;
  themeId: string;
  themeName: string;
  authorOrProvider: string;
  source: string;
  createdDate: string;
  usageRights: string;
  status: 'approved' | 'pending';
  category: 'verified_fact' | 'creative_sample';
  mediaType: 'text' | 'image' | 'audio' | 'document';
  summary: string;
  content: string;
  targetLevel?: 'muc1' | 'muc2' | 'muc3' | 'all';
}

export interface AssignmentQuestion {
  id: string;
  question: string;
  level: 'nhan_biet' | 'thong_hieu' | 'van_dung';
  options: string[];
  correctIndex: number;
  explanation: string;
  scaffoldingHint: string;
}

export interface WritingPrompt {
  genre: 'doan_van' | 'bai_van' | 'tho_luc_bat' | 'nhat_ky';
  topic: string;
  guidingQuestions: string[];
  suggestedOutline: string[];
  rubricCriteria: {
    criterion: string;
    description: string;
    weight: number;
  }[];
}

export interface SpeakingPrompt {
  topic: string;
  timeLimitSeconds: number;
  keyPoints: string[];
}

export interface Assignment {
  id: string;
  title: string;
  themeId: string;
  classId: string;
  type: 'quiz' | 'reading' | 'writing' | 'speaking';
  deadline: string;
  instructions: string;
  targetLevel: 'muc1' | 'muc2' | 'muc3' | 'all';
  materialId?: string;
  questions?: AssignmentQuestion[];
  writingPrompt?: WritingPrompt;
  speakingPrompt?: SpeakingPrompt;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentDisplayName: string;
  classId: string;
  submittedAt: string;
  type: 'quiz' | 'reading' | 'writing' | 'speaking';
  status: 'draft' | 'submitted' | 'graded';
  
  quizAnswers?: number[];
  quizScore?: number;
  readingResponses?: {
    questionId: string;
    answerText: string;
    evidenceText: string;
    level: string;
  }[];
  
  writingDraft1?: string;
  writingDraft1SavedAt?: string;
  aiFeedback1?: {
    structure: string;
    contentAndEmotion: string;
    localImageryAndVocabulary: string;
    grammarAndSpelling: string;
    encouragement: string;
  };
  writingDraft2?: string;
  writingDraft2SavedAt?: string;
  
  audioDataUrl?: string;
  transcriptText?: string;
  speakingSelfReflection?: string;
  
  teacherScore?: number;
  teacherFeedback?: string;
  teacherVerifiedAt?: string;
  teacherName?: string;
}

export interface SurveyEvidence {
  id: string;
  title: string;
  classId: string;
  conductedDate: string;
  metricName: string;
  unit: string;
  isLocked: boolean;
  records: {
    studentCode: string;
    preScore: number;
    postScore: number;
    note?: string;
  }[];
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}
