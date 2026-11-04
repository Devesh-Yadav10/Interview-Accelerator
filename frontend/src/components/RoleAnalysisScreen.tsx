import React from 'react';
import { RoleAnalysis } from '../types';
import { 
  Briefcase, 
  Layers, 
  CheckCircle, 
  Star, 
  BrainCircuit, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Props {
  roleAnalysis: RoleAnalysis;
  onProceed: () => void;
}

export const RoleAnalysisScreen: React.FC<Props> = ({ roleAnalysis, onProceed }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Role Intelligence
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{roleAnalysis.jobTitle}</h2>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-blue-400" />
              {roleAnalysis.companyType}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-400" />
              {roleAnalysis.experienceLevel}
            </span>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all self-start md:self-center"
        >
          View Candidate Match Analysis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Role Summary Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Role Summary</h3>
        <p className="text-slate-200 text-sm leading-relaxed">{roleAnalysis.roleSummary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Core Responsibilities */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Key Responsibilities
          </h3>
          <ul className="space-y-3">
            {roleAnalysis.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Skills */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {roleAnalysis.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-white flex items-center gap-2 pt-2">
            <Star className="w-4 h-4 text-amber-400" />
            Preferred Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {roleAnalysis.preferredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Competencies */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-sky-400" />
            Technical Competencies Evaluated
          </h3>
          <div className="space-y-2.5">
            {roleAnalysis.technicalCompetencies.map((comp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                {comp}
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Competencies */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Behavioral Competencies Evaluated
          </h3>
          <div className="space-y-2.5">
            {roleAnalysis.behavioralCompetencies.map((comp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                {comp}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords and Concepts */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-400" />
          Extracted Key Concepts & Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {roleAnalysis.keyConceptsAndKeywords.map((kw, i) => (
            <span key={i} className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 text-xs font-mono">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

