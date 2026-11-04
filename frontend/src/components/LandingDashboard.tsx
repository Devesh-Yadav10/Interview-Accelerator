import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Target, 
  ShieldCheck, 
  BrainCircuit, 
  Award, 
  FileCheck2, 
  Layers, 
  TrendingUp,
  History
} from 'lucide-react';

interface Props {
  onStartNew: () => void;
  onViewHistory: () => void;
}

export const LandingDashboard: React.FC<Props> = ({ onStartNew, onViewHistory }) => {
  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Production-Grade AI Career Acceleration
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Master High-Stakes Interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">Context-Aware AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload any Job Description and your Resume. Our AI diagnoses your exact skill match, executes a 3-level adaptive voice interview, and builds your evidence-based readiness report.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Launch Interview Accelerator
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-base border border-slate-700 transition-all"
          >
            <History className="w-5 h-5 text-slate-400" />
            Past Sessions
          </button>
        </div>

        {/* Quick Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-blue-400 text-2xl font-bold">100%</div>
            <div className="text-xs text-slate-400 mt-1">Grounding against your actual JD & Resume</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-sky-400 text-2xl font-bold">3 Levels</div>
            <div className="text-xs text-slate-400 mt-1">Screening, Competency, and Deep Architecture</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-indigo-400 text-2xl font-bold">Speech AI</div>
            <div className="text-xs text-slate-400 mt-1">Full voice interview with browser STT/TTS</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-emerald-400 text-2xl font-bold">7 Dimensions</div>
            <div className="text-xs text-slate-400 mt-1">Evidence-based score and study gaps</div>
          </div>
        </div>
      </div>

      {/* The End-to-End Pipeline */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">The Complete Candidate Journey</h2>
          <p className="text-sm text-slate-400 mt-1">From raw PDF extraction to actionable hireability metrics</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">Step 01</div>
            <h3 className="text-lg font-bold text-white mb-2">Role & Candidate Diagnostic</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload PDF/DOCX files or paste text. The AI extracts core competencies, uncovers questionable claims, and assigns an explainable Job Fit score (0–100).
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-sky-400 tracking-wider uppercase mb-1">Step 02</div>
            <h3 className="text-lg font-bold text-white mb-2">Live Adaptive Voice Interview</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter a real-time interview room with speech synthesis and microphone transcription. AI probes vague answers, tests technical depth, and adjusts difficulty on the fly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">Step 03</div>
            <h3 className="text-lg font-bold text-white mb-2">Bar-Raiser Report & Study Plan</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive question-by-question scoring, actionable improvements, ideal answers, readiness tier (e.g. Strong Candidate), and a prioritized prep schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Deep Dive */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" />
            Adaptive Intelligence
          </div>
          <h3 className="text-2xl font-bold text-white">Three Distinct Interview Levels</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Unlike generic mock interviewers that recite pre-canned questions, the engine guides you through a progressive multi-stage evaluation:
          </p>
          <ul className="space-y-3 pt-2 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
              <div>
                <strong className="text-white">Screening:</strong> Career narrative, resume claims, communication, and intrinsic motivation.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
              <div>
                <strong className="text-white">Competency:</strong> Hands-on technical skills, production debugging, API hygiene, and behavioral trade-offs.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
              <div>
                <strong className="text-white">Deep Dive:</strong> High-scale system design, eventual consistency, edge cases, and architectural pushback.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Interview Transcript</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Room
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="bg-blue-950/30 border border-blue-800/40 p-3 rounded-lg text-blue-200">
              <strong className="text-blue-400 block mb-1">AI Interviewer (Level 2 Competency):</strong>
              "In your resume you noted reducing latency by 38% using Redis. How did you handle cache invalidation during race conditions when multiple workers updated the same key?"
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg text-slate-300">
              <strong className="text-slate-400 block mb-1">Candidate (Speech Transcribed):</strong>
              "We used a distributed lock with Redlock and enforced write-through caching with a 60-second TTL..."
            </div>
            <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-lg text-emerald-300">
              <strong className="text-emerald-400 block mb-1">AI Instant Feedback (Score: 88/100):</strong>
              "Strong technical depth. Good mention of Redlock. To achieve 95+, detail your fallback when a lock expires prematurely."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

