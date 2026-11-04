import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface Props {
  onAnalyze: (jdText: string, resumeText: string) => Promise<void>;
  isLoading: boolean;
}

export const DocumentInputScreen: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jdFileName, setJdFileName] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsingJd, setParsingJd] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);

  // Quick Demo Pre-fill function
  const handleLoadSample = () => {
    const sampleJd = `# Senior Full Stack Engineer (React, Node.js, Distributed Systems)

## About the Role
We are seeking an exceptional Senior Full Stack Engineer to lead the architectural evolution of our high-volume real-time collaboration and analytics platform. In this role, you will design robust web services, optimize stateful UI applications, and ensure our distributed cloud infrastructure scales to millions of concurrent operations.

## Key Responsibilities
- Architect, implement, and maintain low-latency frontend applications using React, TypeScript, and modern state management.
- Design and scale distributed backend microservices utilizing Node.js, Express, PostgreSQL, and Redis caching.
- Build clean, backwards-compatible RESTful and GraphQL APIs with strict schema validation and security controls.
- Partner with product managers and UX designers to transform ambiguous business requirements into resilient technical solutions.
- Own reliability, observability, and incident mitigation across our cloud deployment pipelines (Docker, Kubernetes, AWS).
- Mentor engineers, establish engineering standards, and conduct rigorous code and architecture reviews.

## Requirements
- 4+ years of professional software engineering experience building production web applications.
- Strong proficiency in modern JavaScript/TypeScript, React, Node.js, and relational databases (PostgreSQL/MySQL).
- Proven hands-on experience with asynchronous programming, caching strategies, and distributed database consistency.
- Demonstrated ability to debug complex production regressions, profile database queries, and reduce p99 latency.
- Excellent communication skills, autonomous ownership, and bias for action in fast-paced environments.`;

    const sampleResume = `ALEX CHEN
San Francisco, CA • alex.chen@example.com • linkedin.com/in/alexchen-dev • github.com/alexchen

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 4 years of experience building scalable web architectures, reactive client dashboards, and resilient microservices. Proven expertise in React, TypeScript, Node.js, and SQL databases with a track record of driving system performance gains and reliable deployments.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- Frontend: React, Redux Toolkit, Vite, Tailwind CSS, WebSockets, Next.js
- Backend: Node.js, Express, REST APIs, GraphQL, PostgreSQL, Redis, Jest
- Infrastructure & Tools: Docker, Git, CI/CD (GitHub Actions), AWS (S3, EC2, CloudWatch)

PROFESSIONAL EXPERIENCE

Full Stack Software Engineer | CloudVantage Labs
June 2022 – Present | San Francisco, CA
- Spearheaded the redesign of the core analytics dashboard using React 18 and TypeScript, reducing initial load time by 38% and memory consumption by 24%.
- Developed high-throughput REST APIs and WebSocket notification services in Node.js/Express, handling over 1.2M daily events with 99.95% uptime.
- Integrated Redis caching layers for heavy aggregation queries, reducing average database response times from 420ms to 65ms.
- Collaborated with product and security teams to implement JWT-based RBAC, token rotation, and automated audit logging.
- Championed automated unit and integration testing pipelines with Jest and Supertest, expanding test coverage from 52% to 84%.

Software Engineer | NovaSphere Technologies
July 2020 – May 2022 | San Jose, CA
- Built customer-facing features for an enterprise resource management platform using React and PostgreSQL.
- Authored database migrations, optimized indexing on high-traffic tables, and diagnosed deadlocks during transaction spikes.
- Participated in bi-weekly on-call rotations, responding to P1/P2 production incidents and authoring root-cause analysis (RCA) reports.

EDUCATION & CERTIFICATIONS
B.S. in Computer Science | University of California, Davis
AWS Certified Solutions Architect – Associate`;

    setJdText(sampleJd);
    setResumeText(sampleResume);
    setJdFileName('sample_senior_fullstack_jd.txt');
    setResumeFileName('alex_chen_resume.txt');
    setUploadError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'jd' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 20MB.`);
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    if (type === 'jd') setParsingJd(true);
    else setParsingResume(true);

    try {
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse file.');
      }

      if (type === 'jd') {
        setJdText(data.extractedText);
        setJdFileName(file.name);
      } else {
        setResumeText(data.extractedText);
        setResumeFileName(file.name);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading and extracting text.');
    } finally {
      if (type === 'jd') setParsingJd(false);
      else setParsingResume(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jdText.trim().length < 30) {
      setUploadError('Please provide a complete Job Description (at least 30 characters).');
      return;
    }
    if (resumeText.trim().length < 30) {
      setUploadError('Please provide a complete Resume (at least 30 characters).');
      return;
    }

    setUploadError(null);
    onAnalyze(jdText, resumeText);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Step 1: Input & Document Processing</h2>
          <p className="text-slate-400 text-sm mt-1">
            Provide the target Job Description and Candidate Resume. Supports PDF, DOCX, TXT, or direct text.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition"
        >
          <BookOpen className="w-4 h-4" />
          Load Production Sample (Senior Full-Stack)
        </button>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <div>{uploadError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Job Description Column */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <label className="text-base font-bold text-white">Target Job Description (JD)</label>
              </div>
              {jdFileName && (
                <span className="text-xs text-blue-400 font-mono truncate max-w-[150px]">
                  {jdFileName}
                </span>
              )}
            </div>

            {/* Upload Box */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-900/40">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFileUpload(e, 'jd')}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-2">
                {parsingJd ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-blue-400">Click to upload JD</span> (PDF, DOCX, TXT)
                </div>
                <div className="text-[11px] text-slate-500">Max size 20MB</div>
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Or paste raw JD text:</span>
                <span>{jdText.length} chars</span>
              </div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the target job description here..."
                rows={12}
                className="w-full flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Resume Column */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <label className="text-base font-bold text-white">Candidate Resume</label>
              </div>
              {resumeFileName && (
                <span className="text-xs text-indigo-400 font-mono truncate max-w-[150px]">
                  {resumeFileName}
                </span>
              )}
            </div>

            {/* Upload Box */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-900/40">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-2">
                {parsingResume ? (
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-indigo-400">Click to upload Resume</span> (PDF, DOCX, TXT)
                </div>
                <div className="text-[11px] text-slate-500">Max size 20MB</div>
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Or paste resume text:</span>
                <span>{resumeText.length} chars</span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume or CV text here..."
                rows={12}
                className="w-full flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || parsingJd || parsingResume || !jdText || !resumeText}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Documents & Grounding Competencies...
              </>
            ) : (
              <>
                Analyze Match & Generate Diagnostic
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

