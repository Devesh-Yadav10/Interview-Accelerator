export interface RoleAnalysis {
  source?: string;
  jobTitle: string;
  companyType: string;
  experienceLevel: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  technicalCompetencies: string[];
  behavioralCompetencies: string[];
  keyConceptsAndKeywords: string[];
  roleSummary: string;
}

export interface StrongMatch {
  skill: string;
  evidence: string;
}

export interface PartialMatch {
  skill: string;
  gap: string;
}

export interface CandidateAnalysis {
  source?: string;
  candidateName: string;
  jobFitScore: number;
  scoreExplanation: string;
  strongMatches: StrongMatch[];
  partialMatches: PartialMatch[];
  missingMatches: string[];
  questionableClaims: string[];
  weakAreas: string[];
  personalizedPrepRequirements: string[];
}

export interface AnswerScores {
  technicalCorrectness: number;
  relevance: number;
  depth: number;
  problemSolving: number;
  clarity: number;
  communication: number;
  evidenceAndExamples: number;
}

export interface AnswerEvaluation {
  source?: string;
  overallAnswerScore: number;
  scores: AnswerScores;
  whatWasGood: string;
  whatWasMissing: string;
  whatWasIncorrect: string;
  howToImprove: string;
  idealAnswerSummary: string;
}

export interface QuestionData {
  exchangeId?: string;
  level?: number;
  questionIndex?: number;
  questionText: string;
  competency: string;
  difficulty: string;
  interviewerNotes: string;
  isLevelComplete?: boolean;
}

export interface StudyPlanItem {
  priority: 'High' | 'Medium' | 'Low';
  topic: string;
  recommendedAction: string;
  estimatedHours: number;
}

export interface FinalReport {
  source?: string;
  overallScore: number;
  readinessClassification: 'Not Ready' | 'Needs Preparation' | 'Interview Ready' | 'Strong Candidate';
  readinessSummary: string;
  dimensionScores: {
    roleFit: number;
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    observableConfidence: number;
    depthOfUnderstanding: number;
    behavioralFit: number;
  };
  strengths: string[];
  weaknesses: string[];
  personalizedPreparationGaps: string[];
  prioritizedStudyPlan: StudyPlanItem[];
  hiringRecommendation: string;
  barRaiserNotes: string;
}

export interface ExchangeRecord {
  id: string;
  level: number;
  questionIndex: number;
  competency: string;
  questionText: string;
  candidateAnswer: string;
  durationSeconds: number;
  scores: AnswerScores | null;
  evaluation: AnswerEvaluation | null;
  timestamp: string;
}

export interface InterviewHistoryItem {
  id: string;
  created_at: string;
  status: string;
  overall_score: number | null;
  current_level: number;
  candidate_name: string;
  job_title: string;
  job_fit_score: number;
}

