import React, { useState } from 'react';
import { 
  RoleAnalysis, 
  CandidateAnalysis, 
  QuestionData, 
  AnswerEvaluation, 
  FinalReport, 
  ExchangeRecord 
} from './types';

import { LandingDashboard } from './components/LandingDashboard';
import { DocumentInputScreen } from './components/DocumentInputScreen';
import { RoleAnalysisScreen } from './components/RoleAnalysisScreen';
import { CandidateAnalysisScreen } from './components/CandidateAnalysisScreen';
import { InterviewSetupScreen } from './components/InterviewSetupScreen';
import { LiveInterviewScreen } from './components/LiveInterviewScreen';
import { ResultsReportScreen } from './components/ResultsReportScreen';
import { DetailedQuestionFeedback } from './components/DetailedQuestionFeedback';
import { InterviewHistoryScreen } from './components/InterviewHistoryScreen';

import { 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Layers, 
  History, 
  Home, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export type ScreenState = 
  | 'landing'
  | 'input'
  | 'role-analysis'
  | 'candidate-analysis'
  | 'setup'
  | 'interview'
  | 'results'
  | 'feedback'
  | 'history';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('landing');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Core Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roleAnalysis, setRoleAnalysis] = useState<RoleAnalysis | null>(null);
  const [candidateAnalysis, setCandidateAnalysis] = useState<CandidateAnalysis | null>(null);

  // Live Interview State
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelName, setLevelName] = useState<string>('Screening Interview');
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableCamera, setEnableCamera] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null);

  // Final Results & Exchanges History
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [exchanges, setExchanges] = useState<ExchangeRecord[]>([]);

  // 1. Submit JD & Resume for Role & Candidate Analysis
  const handleAnalyzeDocuments = async (jdText: string, resumeText: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/sessions/create-and-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText, resumeText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze documents.');
      }

      setSessionId(data.sessionId);
      setRoleAnalysis(data.roleAnalysis);
      setCandidateAnalysis(data.candidateAnalysis);
      setCurrentScreen('role-analysis');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Launch Live Interview
  const handleLaunchInterview = async (options: { enableVoice: boolean; enableCamera: boolean }) => {
    if (!sessionId) return;
    setLoading(true);
    setErrorMsg(null);
    setEnableVoice(options.enableVoice);
    setEnableCamera(options.enableCamera);

    try {
      const res = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start interview.');
      }

      setInterviewId(data.interviewId);
      setCurrentLevel(data.level);
      setLevelName(data.levelName);
      setCurrentQuestion({
        ...data.question,
        exchangeId: data.exchangeId
      });
      setLastEvaluation(null);
      setCurrentScreen('interview');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initializing interview session.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Candidate Answer
  const handleSubmitAnswer = async (answerText: string, durationSeconds: number) => {
    if (!interviewId || !currentQuestion?.exchangeId) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/interviews/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          exchangeId: currentQuestion.exchangeId,
          answerText,
          durationSeconds
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit answer.');
      }

      setLastEvaluation(data.evaluation);

      // Add to local exchanges list
      setExchanges(prev => [
        ...prev,
        {
          id: currentQuestion.exchangeId!,
          level: currentLevel,
          questionIndex: currentQuestion.questionIndex || 0,
          competency: currentQuestion.competency,
          questionText: currentQuestion.questionText,
          candidateAnswer: answerText,
          durationSeconds,
          scores: data.evaluation.scores,
          evaluation: data.evaluation,
          timestamp: new Date().toISOString()
        }
      ]);

      if (data.isInterviewComplete) {
        setFinalReport(data.finalReport);
        setCurrentScreen('results');
      } else {
        setCurrentLevel(data.currentLevel);
        setLevelName(data.levelName);
        setCurrentQuestion(data.nextQuestion);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error evaluating answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Conclude Interview Early
  const handleFinishEarly = async () => {
    if (!interviewId) return;
    if (!window.confirm("Conclude the live interview now and generate your comprehensive performance report?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/interviews/${interviewId}/finish`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to finish interview.');

      setFinalReport(data.finalReport);
      // Fetch full interview detail
      const detailRes = await fetch(`/api/interviews/${interviewId}`);
      const detailData = await detailRes.json();
      if (detailData.exchanges) {
        setExchanges(detailData.exchanges);
      }
      setCurrentScreen('results');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Select Past Interview from History
  const handleSelectPastInterview = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/interviews/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRoleAnalysis(data.session.roleAnalysis);
      setCandidateAnalysis(data.session.candidateAnalysis);
      setFinalReport(data.interview.report);
      setExchanges(data.exchanges);
      setCurrentScreen('results');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Reset State
  const handleReset = () => {
    setSessionId(null);
    setRoleAnalysis(null);
    setCandidateAnalysis(null);
    setInterviewId(null);
    setCurrentQuestion(null);
    setLastEvaluation(null);
    setFinalReport(null);
    setExchanges([]);
    setCurrentScreen('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Global Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div 
          onClick={handleReset}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              Interview<span className="text-blue-400">Accelerator</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Contextual Candidate AI Evaluation</div>
          </div>
        </div>

        {/* Navigation Breadcrumb / Shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentScreen === 'landing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentScreen === 'input' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Interview</span>
          </button>

          <button
            onClick={() => setCurrentScreen('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentScreen === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </header>

      {/* Global Error Alert */}
      {errorMsg && (
        <div className="max-w-5xl mx-auto px-6 pt-4 w-full">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex justify-between items-center">
            <span>{errorMsg}</span>
            <button 
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6">
        {currentScreen === 'landing' && (
          <LandingDashboard
            onStartNew={() => setCurrentScreen('input')}
            onViewHistory={() => setCurrentScreen('history')}
          />
        )}

        {currentScreen === 'input' && (
          <DocumentInputScreen
            onAnalyze={handleAnalyzeDocuments}
            isLoading={loading}
          />
        )}

        {currentScreen === 'role-analysis' && roleAnalysis && (
          <RoleAnalysisScreen
            roleAnalysis={roleAnalysis}
            onProceed={() => setCurrentScreen('candidate-analysis')}
          />
        )}

        {currentScreen === 'candidate-analysis' && candidateAnalysis && (
          <CandidateAnalysisScreen
            candidateAnalysis={candidateAnalysis}
            onProceedToSetup={() => setCurrentScreen('setup')}
          />
        )}

        {currentScreen === 'setup' && roleAnalysis && candidateAnalysis && (
          <InterviewSetupScreen
            roleAnalysis={roleAnalysis}
            candidateAnalysis={candidateAnalysis}
            onLaunchInterview={handleLaunchInterview}
            isLoading={loading}
          />
        )}

        {currentScreen === 'interview' && roleAnalysis && candidateAnalysis && currentQuestion && interviewId && (
          <LiveInterviewScreen
            roleAnalysis={roleAnalysis}
            candidateAnalysis={candidateAnalysis}
            currentQuestion={currentQuestion}
            currentLevel={currentLevel}
            levelName={levelName}
            interviewId={interviewId}
            enableVoice={enableVoice}
            enableCamera={enableCamera}
            onSubmitAnswer={handleSubmitAnswer}
            onFinishEarly={handleFinishEarly}
            isSubmitting={isSubmitting}
            lastEvaluation={lastEvaluation}
          />
        )}

        {currentScreen === 'results' && finalReport && (
          <ResultsReportScreen
            report={finalReport}
            exchanges={exchanges}
            onRestart={handleReset}
            onViewQuestionFeedback={() => setCurrentScreen('feedback')}
          />
        )}

        {currentScreen === 'feedback' && (
          <DetailedQuestionFeedback
            exchanges={exchanges}
            onBackToReport={() => setCurrentScreen('results')}
          />
        )}

        {currentScreen === 'history' && (
          <InterviewHistoryScreen
            onBack={() => setCurrentScreen('landing')}
            onSelectInterview={handleSelectPastInterview}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
        AI Interview Accelerator • Context-Grounded Speech & Behavioral Evaluation • SQLite Persistence Layer
      </footer>
    </div>
  );
};

export default App;

