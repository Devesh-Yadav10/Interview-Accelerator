import React from 'react';
import { FinalReport, ExchangeRecord } from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Layers, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  ListOrdered
} from 'lucide-react';

interface Props {
  report: FinalReport;
  exchanges: ExchangeRecord[];
  onRestart: () => void;
  onViewQuestionFeedback: () => void;
}

export const ResultsReportScreen: React.FC<Props> = ({
  report,
  exchanges,
  onRestart,
  onViewQuestionFeedback
}) => {
  const getReadinessBadge = (status: string) => {
    switch (status) {
      case 'Strong Candidate':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Interview Ready':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Needs Preparation':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Interview Complete • Executive Evaluation
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Final Performance & Readiness Report
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Aggregated diagnostic across all adaptive interview levels and competencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewQuestionFeedback}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <ListOrdered className="w-4 h-4 text-blue-400" />
            Question-by-Question Breakdown
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
          >
            <RotateCcw className="w-4 h-4" />
            New Practice Session
          </button>
        </div>
      </div>

      {/* Hero Scorecard */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid md:grid-cols-12 gap-6 items-center">
        {/* Score dial */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-blue-500/20 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white tracking-tight">
                {report.overallScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Out of 100
              </span>
            </div>
          </div>

          <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold border ${getReadinessBadge(report.readinessClassification)}`}>
            {report.readinessClassification}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Recommendation: <strong className="text-white">{report.hiringRecommendation}</strong>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Executive Readiness Summary
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed">
            {report.readinessSummary}
          </p>
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-300">Bar Raiser Assessment: </strong>
            {report.barRaiserNotes}
          </div>
        </div>
      </div>

      {/* 7-Dimension Competency Scores */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          7-Dimension Competency Evaluation
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(report.dimensionScores).map(([key, val]) => {
            const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="p-3.5 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">{formatted}</span>
                  <span className="text-white font-bold">{val}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Evidenced Strengths
          </h3>
          <ul className="space-y-2.5">
            {report.strengths.map((str, i) => (
              <li key={i} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Identified Vulnerabilities & Gaps
          </h3>
          <ul className="space-y-2.5">
            {report.weaknesses.map((weak, i) => (
              <li key={i} className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Prioritized Study Plan */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          Prioritized Study & Action Plan
        </h3>

        <div className="space-y-3">
          {report.prioritizedStudyPlan.map((plan, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    plan.priority === 'High'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {plan.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-white">{plan.topic}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{plan.recommendedAction}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Est. {plan.estimatedHours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

