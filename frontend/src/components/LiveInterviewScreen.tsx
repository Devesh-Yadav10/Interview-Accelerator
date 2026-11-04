import React, { useState, useEffect, useRef } from 'react';
import { 
  QuestionData, 
  AnswerEvaluation, 
  RoleAnalysis, 
  CandidateAnalysis 
} from '../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Pause, 
  StopCircle, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  User, 
  Bot, 
  Clock, 
  Award, 
  Layers,
  ChevronRight,
  Video,
  VideoOff
} from 'lucide-react';

interface Props {
  roleAnalysis: RoleAnalysis;
  candidateAnalysis: CandidateAnalysis;
  currentQuestion: QuestionData;
  currentLevel: number;
  levelName: string;
  interviewId: string;
  enableVoice: boolean;
  enableCamera: boolean;
  onSubmitAnswer: (answer: string, durationSeconds: number) => Promise<void>;
  onFinishEarly: () => Promise<void>;
  isSubmitting: boolean;
  lastEvaluation: AnswerEvaluation | null;
}

export const LiveInterviewScreen: React.FC<Props> = ({
  roleAnalysis,
  candidateAnalysis,
  currentQuestion,
  currentLevel,
  levelName,
  interviewId,
  enableVoice,
  enableCamera,
  onSubmitAnswer,
  onFinishEarly,
  isSubmitting,
  lastEvaluation
}) => {
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cameraActive, setCameraActive] = useState(enableCamera);
  const [audioError, setAudioError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Auto-speak question when it changes (TTS)
  useEffect(() => {
    if (currentQuestion && enableVoice) {
      speakQuestion(currentQuestion.questionText);
    }
    setTranscript('');
    setManualText('');
    setElapsedSeconds(0);
  }, [currentQuestion]);

  // Answer timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQuestion]);

  // Video stream initialization
  useEffect(() => {
    if (cameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraActive(false);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  // Speech Recognition (STT) setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => (prev + ' ' + final).trim() || interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setAudioError('Microphone permission blocked. You can type your response below.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      setAudioError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn('Speech rec error on start:', e);
          setIsListening(false);
        }
      } else {
        setAudioError('Speech recognition is not supported in this browser. Please type your response.');
      }
    }
  };

  const handleSendAnswer = () => {
    const finalAnswer = (transcript + ' ' + manualText).trim();
    if (!finalAnswer) return;

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    }

    onSubmitAnswer(finalAnswer, elapsedSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Top Status Bar */}
      <div className="glass-panel px-6 py-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Interview Session</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-300 font-semibold">{roleAnalysis.jobTitle}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Level Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Layers className="w-3.5 h-3.5" />
            Level {currentLevel}: {levelName}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formatTime(elapsedSeconds)}
          </div>

          {/* Conclude Early Button */}
          <button
            onClick={onFinishEarly}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 font-medium transition"
          >
            <StopCircle className="w-3.5 h-3.5" />
            Conclude & Evaluate
          </button>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Column: AI Interviewer & Question Stage */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
            {/* AI Avatar & Identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AI Senior Interviewer
                    {isSpeakingQuestion && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold animate-pulse">
                        Speaking...
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">Testing: {currentQuestion.competency}</p>
                </div>
              </div>

              <button
                onClick={() => speakQuestion(currentQuestion.questionText)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs"
                title="Replay Voice"
              >
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Replay Question</span>
              </button>
            </div>

            {/* The Question Prompt Card */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-blue-400 uppercase tracking-wider">
                  Target Competency: {currentQuestion.competency}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
                  Difficulty: {currentQuestion.difficulty}
                </span>
              </div>
              <p className="text-base md:text-lg font-medium text-slate-100 leading-relaxed">
                "{currentQuestion.questionText}"
              </p>
              {currentQuestion.interviewerNotes && (
                <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
                  <span className="font-semibold text-slate-400">Interviewer focus: </span>
                  {currentQuestion.interviewerNotes}
                </div>
              )}
            </div>

            {/* Live Audio Waves / Speaking visualizer */}
            <div className="flex items-center justify-center gap-1 h-8">
              {[40, 70, 95, 60, 85, 45, 100, 75, 50, 80, 65, 90].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : isSpeakingQuestion
                      ? 'bg-blue-400 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                  style={{
                    height: isListening || isSpeakingQuestion ? `${h}%` : '20%',
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>

            {/* Previous Answer Evaluation Pill (if any) */}
            {lastEvaluation && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Last Answer Evaluation
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Score: {lastEvaluation.overallAnswerScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-emerald-400">Good: </strong>{lastEvaluation.whatWasGood}
                </p>
                {lastEvaluation.howToImprove && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-blue-400">Tip: </strong>{lastEvaluation.howToImprove}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidate Speaking, Camera Preview & Input Fallback */}
        <div className="md:col-span-5 space-y-6 flex flex-col">
          {/* Candidate Video & Audio Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Candidate: {candidateAnalysis.candidateName}
                  </span>
                </div>
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {cameraActive ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <VideoOff className="w-3.5 h-3.5" />}
                  {cameraActive ? 'Hide Camera' : 'Show Camera'}
                </button>
              </div>

              {/* Camera Preview */}
              {cameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Preview Live
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-900/60 aspect-video border border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <VideoOff className="w-8 h-8 opacity-40" />
                  <span className="text-xs">Camera preview hidden</span>
                </div>
              )}

              {/* Live Speech Recognition Transcript */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium flex items-center gap-1.5">
                    <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                    Live Speech Transcript
                  </span>
                  {isListening && <span className="text-[10px] text-emerald-400 font-bold uppercase">Listening...</span>}
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl min-h-[75px] max-h-[110px] overflow-y-auto text-xs text-slate-200 font-mono">
                  {transcript || (
                    <span className="text-slate-600 italic">
                      Click the microphone button and speak your response, or type directly below...
                    </span>
                  )}
                </div>
              </div>

              {/* Text Fallback Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Manual / Fallback Text Input:</span>
                  <span>{manualText.length} chars</span>
                </label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Type or edit your answer here if preferred..."
                  rows={3}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {audioError && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  {audioError}
                </div>
              )}
            </div>

            {/* Action Bar: Mic Toggle & Submit */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={toggleMic}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  isListening
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 text-red-400" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-400" />
                    Start Speaking (Mic)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendAnswer}
                disabled={isSubmitting || (!transcript.trim() && !manualText.trim())}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

