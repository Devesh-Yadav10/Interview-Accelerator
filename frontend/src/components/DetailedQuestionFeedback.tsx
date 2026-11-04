import React, { useState } from 'react';
import { ExchangeRecord } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  Clock, 
  Layers, 
  User, 
  Bot,
  Lightbulb
} from 'lucide-react';

interface Props {
  exchanges: ExchangeRecord[];
  onBackToReport: () => void;
}

export const DetailedQuestionFeedback: React.FC<Props> = ({ exchanges, onBackToReport }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!exchanges || exchanges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <p className="text-slate-400">No question exchanges recorded for this session.</p>
        <button
          onClick={onBackToReport}
          className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-white"
        >
          Return to Report
        </button>
      </div>
    );
  }

  const current = exchanges[selectedIdx];
  const evalData = current.evaluation;
  const scores = current.scores;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBackToReport}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Performance Report
        </button>
        <div className="text-xs text-slate-400">
          Showing Question <strong className="text-white">{selectedIdx + 1}</strong> of <strong className="text-white">{exchanges.length}</strong>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {exchanges.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border ${
              selectedIdx === i
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>Q{i + 1}</span>
            <span className="opacity-75 text-[11px]">Level {ex.level}</span>
            {ex.scores && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                ex.scores.technicalCorrectness >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {ex.evaluation?.overallAnswerScore || 75}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Question & Answer Detail */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Left: The Exchange */}
        <div className="md:col-span-6 space-y-4">
          {/* Question Box */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                Interviewer Question (Level {current.level})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {current.competency}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              "{current.questionText}"
            </p>
          </div>

          {/* Candidate Response Box */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Candidate Response
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {current.durationSeconds}s
              </span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {current.candidateAnswer || '(No speech recorded)'}
            </div>
          </div>

          {/* Rubric Dimension breakdown */}
          {scores && (
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evaluation Rubric Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(scores).map(([k, v]) => {
                  const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                  return (
                    <div key={k} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-bold text-slate-200">{v}/100</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Evaluator Feedback */}
        <div className="md:col-span-6 space-y-4">
          {evalData ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Evaluator Assessment
                </span>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                  Score: {evalData.overallAnswerScore}/100
                </div>
              </div>

              {/* What Was Good */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  What Was Good
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                  {evalData.whatWasGood}
                </p>
              </div>

              {/* What Was Missing */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  What Was Missing / Unaddressed
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-900/30">
                  {evalData.whatWasMissing}
                </p>
              </div>

              {/* How To Improve */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  How to Improve (Actionable Framework)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-sky-950/20 p-3 rounded-xl border border-sky-900/30">
                  {evalData.howToImprove}
                </p>
              </div>

              {/* Ideal Answer Summary */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Ideal Model Answer Structure
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {evalData.idealAnswerSummary}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No detailed evaluation data available for this question.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

