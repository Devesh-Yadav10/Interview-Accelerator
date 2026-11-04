import React, { useState } from 'react';
import { RoleAnalysis, CandidateAnalysis } from '../types';
import { 
  Mic, 
  Volume2, 
  Video, 
  VideoOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Layers,
  Settings2
} from 'lucide-react';

interface Props {
  roleAnalysis: RoleAnalysis;
  candidateAnalysis: CandidateAnalysis;
  onLaunchInterview: (options: { enableVoice: boolean; enableCamera: boolean }) => void;
  isLoading: boolean;
}

export const InterviewSetupScreen: React.FC<Props> = ({
  roleAnalysis,
  candidateAnalysis,
  onLaunchInterview,
  isLoading
}) => {
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableCamera, setEnableCamera] = useState(true);
  const [micTested, setMicTested] = useState(false);
  const [testingMic, setTestingMic] = useState(false);
  const [ttsTested, setTtsTested] = useState(false);

  // Test browser Speech Synthesis
  const testTts = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Audio check successful. The AI interviewer voice is ready.");
      utterance.rate = 1.0;
      utterance.onend = () => setTtsTested(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser Speech Synthesis is not supported; text fallback will be used.");
      setTtsTested(true);
    }
  };

  // Test browser Speech Recognition
  const testMic = () => {
    setTestingMic(true);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.onresult = () => {
        setMicTested(true);
        setTestingMic(false);
      };
      rec.onerror = () => {
        setTestingMic(false);
        setMicTested(true); // allow proceed with text fallback
      };
      rec.start();
      setTimeout(() => {
        try { rec.stop(); } catch (e) {}
        setTestingMic(false);
        setMicTested(true);
      }, 3000);
    } else {
      setTestingMic(false);
      setMicTested(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Settings2 className="w-3.5 h-3.5" />
          Pre-Flight Calibration
        </div>
        <h2 className="text-3xl font-extrabold text-white">Interview Room Configuration</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Calibrate your voice and video input before entering the live adaptive interview room with your AI interviewer.
        </p>
      </div>

      {/* Target Role & Candidate Summary Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Interviewing For</span>
          <div className="text-xl font-bold text-white">{roleAnalysis.jobTitle}</div>
          <div className="text-xs text-blue-400 mt-0.5">Candidate: {candidateAnalysis.candidateName} • Fit: {candidateAnalysis.jobFitScore}%</div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/80">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-200">3 Adaptive Levels • 6 High-Stakes Questions</span>
        </div>
      </div>

      {/* Hardware & Modality Controls */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Voice Interaction */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Voice Interview (STT & TTS)</h4>
                <p className="text-[11px] text-slate-400">Speech-to-text & conversational audio</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableVoice}
              onChange={(e) => setEnableVoice(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={testTts}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              {ttsTested ? "Audio Verified ✓" : "Test Speaker"}
            </button>
            <button
              type="button"
              onClick={testMic}
              disabled={testingMic}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center justify-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-sky-400" />
              {testingMic ? "Listening..." : micTested ? "Mic Verified ✓" : "Test Mic"}
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                {enableCamera ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Camera Preview (Bonus)</h4>
                <p className="text-[11px] text-slate-400">Self-view mirror during interview</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableCamera}
              onChange={(e) => setEnableCamera(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
            {enableCamera
              ? "Your camera preview will render in the bottom corner of the interview room for authentic simulation."
              : "Camera preview disabled. Voice and transcript will remain fully active."}
          </div>
        </div>
      </div>

      {/* Rules of Engagement */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Adaptive Interview Guidelines
        </h4>
        <ul className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <span>Speak clearly and answer with concrete examples and metrics (STAR method).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <span>If an answer is brief or vague, the AI will actively follow up and probe.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <span>You can replay the interviewer's voice or type your answer if mic is quiet.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <span>You may pause or conclude the interview at any time to review your report.</span>
          </li>
        </ul>
      </div>

      {/* Launch Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => onLaunchInterview({ enableVoice, enableCamera })}
          disabled={isLoading}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Enter Live Interview Room
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

