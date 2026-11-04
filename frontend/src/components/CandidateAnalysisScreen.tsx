import React from 'react';
import { CandidateAnalysis } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ShieldAlert, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';

interface Props {
  candidateAnalysis: CandidateAnalysis;
  onProceedToSetup: () => void;
}

export const CandidateAnalysisScreen: React.FC<Props> = ({ candidateAnalysis, onProceedToSetup }) => {
  const score = candidateAnalysis.jobFitScore;

  // Color scheme based on score
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 65) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Candidate Diagnostic Profile
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {candidateAnalysis.candidateName}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Detailed evaluation of resume claims, competency matches, and identified preparation gaps.
          </p>
        </div>

        <button
          onClick={onProceedToSetup}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all self-start md:self-center"
        >
          Setup Adaptive Interview
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Explainable Job Fit Score Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-2 flex-shrink-0 ${getScoreColor(score)}`}>
          <span className="text-4xl font-extrabold tracking-tight">{score}</span>
          <span className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-80">Job Fit Score</span>
        </div>

        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Explainable Score Breakdown
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {candidateAnalysis.scoreExplanation}
          </p>
          <div className="text-[11px] text-slate-400 italic">
            * Score is derived strictly from evidenced resume experience matched with core JD requirements.
          </div>
        </div>
      </div>

      {/* Grid: Matches vs Missing */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strong Matches */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Strong Matches ({candidateAnalysis.strongMatches.length})
          </div>
          <div className="space-y-2.5">
            {candidateAnalysis.strongMatches.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs">
                <div className="font-semibold text-emerald-300">{m.skill}</div>
                <div className="text-slate-400 text-[11px] mt-1">{m.evidence}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partial Matches */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Partial Matches ({candidateAnalysis.partialMatches.length})
          </div>
          <div className="space-y-2.5">
            {candidateAnalysis.partialMatches.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs">
                <div className="font-semibold text-amber-300">{m.skill}</div>
                <div className="text-slate-400 text-[11px] mt-1">{m.gap}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Matches */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <XCircle className="w-4 h-4" />
            Missing / Unverified Skills ({candidateAnalysis.missingMatches.length})
          </div>
          <div className="space-y-2">
            {candidateAnalysis.missingMatches.map((skill, i) => (
              <div key={i} className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs font-semibold text-red-300">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrutiny: Questionable Claims & Weak Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 text-amber-400">
            <HelpCircle className="w-4 h-4" />
            Vague or Questionable Resume Claims
          </h3>
          <p className="text-xs text-slate-400">
            Our AI interviewer will specifically interrogate these points to verify authentic depth:
          </p>
          <ul className="space-y-2.5">
            {candidateAnalysis.questionableClaims.map((claim, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{claim}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 text-sky-400">
            <Compass className="w-4 h-4" />
            Personalized Prep Requirements
          </h3>
          <p className="text-xs text-slate-400">
            Recommended focus areas prior to taking the live interview:
          </p>
          <ul className="space-y-2.5">
            {candidateAnalysis.personalizedPrepRequirements.map((req, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

