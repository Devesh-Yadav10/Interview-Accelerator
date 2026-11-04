import React, { useEffect, useState } from 'react';
import { InterviewHistoryItem } from '../types';
import { 
  ArrowLeft, 
  History, 
  Clock, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Loader2,
  Calendar
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectInterview: (id: string) => void;
}

export const InterviewHistoryScreen: React.FC<Props> = ({ onBack, onSelectInterview }) => {
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interviews')
      .then(res => res.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          Past Interview Sessions
        </h2>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xs">Loading session records from SQLite database...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-sm">No completed interview sessions yet.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
          >
            Start Your First Practice Interview
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectInterview(item.id)}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.job_title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Candidate: <strong className="text-slate-300">{item.candidate_name}</strong></span>
                  <span>•</span>
                  <span>Initial Fit: <strong className="text-blue-400">{item.job_fit_score}%</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.overall_score !== null && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{item.overall_score}/100</div>
                    <div className="text-[10px] text-slate-400 uppercase">Performance</div>
                  </div>
                )}
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

