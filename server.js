require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('./backend/db');
const { extractTextFromBuffer } = require('./backend/documentParser');
const {
  analyzeJobDescription,
  analyzeCandidateAgainstJD,
  generateNextQuestion,
  evaluateAnswer,
  generateFinalReport
} = require('./backend/aiEngine');

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Multer memory storage for direct buffer handling (supporting up to 25MB files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ---------------- API ROUTES ----------------

// Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    aiEngine: GEMINI_API_KEY ? 'gemini-1.5-flash-active' : 'deterministic-adaptive-fallback-active',
    database: 'json-persistence-active'
  });
});

// Upload and Parse Documents (JD or Resume)
app.post('/api/parse-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    if (size === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty.' });
    }

    const text = await extractTextFromBuffer(buffer, originalname, mimetype);
    if (!text || text.trim().length === 0) {
      return res.status(422).json({ error: 'Could not extract readable text from document.' });
    }

    res.json({
      filename: originalname,
      mimetype,
      size,
      textLength: text.length,
      extractedText: text
    });
  } catch (error) {
    console.error('Document parsing endpoint error:', error);
    res.status(500).json({ error: error.message || 'Error processing document.' });
  }
});

// Create Full Session & Perform Role + Candidate Analysis
app.post('/api/sessions/create-and-analyze', async (req, res) => {
  try {
    const { jdText, resumeText, jobTitle } = req.body;

    if (!jdText || jdText.trim().length < 20) {
      return res.status(400).json({ error: 'A valid Job Description is required (min 20 characters).' });
    }
    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'A valid Resume is required (min 20 characters).' });
    }

    // 1. AI Role Analysis
    const roleAnalysis = await analyzeJobDescription(jdText, GEMINI_API_KEY);

    // 2. AI Candidate & Job Fit Analysis
    const candidateAnalysis = await analyzeCandidateAgainstJD(resumeText, roleAnalysis, GEMINI_API_KEY);

    const sessionId = uuidv4();
    const finalTitle = jobTitle || roleAnalysis.jobTitle || 'Software Engineer';
    const candidateName = candidateAnalysis.candidateName || 'Candidate';

    db.saveSession({
      id: sessionId,
      job_title: finalTitle,
      jd_text: jdText,
      resume_text: resumeText,
      candidate_name: candidateName,
      role_analysis: roleAnalysis,
      candidate_analysis: candidateAnalysis,
      job_fit_score: candidateAnalysis.jobFitScore
    });

    res.json({
      sessionId,
      candidateName,
      jobTitle: finalTitle,
      jobFitScore: candidateAnalysis.jobFitScore,
      roleAnalysis,
      candidateAnalysis
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to process and analyze profile.' });
  }
});

// Retrieve an existing Session
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const session = db.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      id: session.id,
      createdAt: session.created_at,
      jobTitle: session.job_title,
      candidateName: session.candidate_name,
      jobFitScore: session.job_fit_score,
      jdText: session.jd_text,
      resumeText: session.resume_text,
      roleAnalysis: session.role_analysis,
      candidateAnalysis: session.candidate_analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start a New Adaptive Interview
app.post('/api/interviews/start', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const interviewId = uuidv4();
    db.createInterview({
      id: interviewId,
      session_id: sessionId,
      current_level: 1,
      status: 'in_progress'
    });

    const roleAnalysis = session.role_analysis;
    const candidateAnalysis = session.candidate_analysis;

    // Generate initial question for Level 1 (Screening)
    const firstQuestion = await generateNextQuestion({
      level: 1,
      questionIndex: 0,
      totalQuestionsInLevel: 2,
      roleAnalysis,
      candidateAnalysis,
      conversationHistory: [],
      apiKey: GEMINI_API_KEY
    });

    const exchangeId = uuidv4();
    db.addExchange({
      id: exchangeId,
      interview_id: interviewId,
      level: 1,
      question_index: 0,
      competency: firstQuestion.competency,
      question_text: firstQuestion.questionText
    });

    res.json({
      interviewId,
      sessionId,
      level: 1,
      levelName: 'Screening Interview',
      levelDescription: 'Motivation, career journey, communication, and overall role fit.',
      questionIndex: 0,
      exchangeId,
      question: firstQuestion
    });
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({ error: error.message || 'Failed to start interview.' });
  }
});

// Submit Candidate Answer, Evaluate, and Generate Next Question
app.post('/api/interviews/submit-answer', async (req, res) => {
  try {
    const { interviewId, exchangeId, answerText, durationSeconds = 30 } = req.body;

    if (!interviewId || !exchangeId) {
      return res.status(400).json({ error: 'interviewId and exchangeId are required.' });
    }

    const exchange = db.getExchange(exchangeId);
    if (!exchange) {
      return res.status(404).json({ error: 'Exchange not found.' });
    }

    const interview = db.getInterview(interviewId);
    const session = db.getSession(interview.session_id);
    const roleAnalysis = session.role_analysis;
    const candidateAnalysis = session.candidate_analysis;

    // 1. Evaluate candidate answer
    const evaluation = await evaluateAnswer({
      question: exchange.question_text,
      competency: exchange.competency,
      candidateAnswer: answerText || '(Candidate provided a brief or silent answer)',
      durationSeconds,
      apiKey: GEMINI_API_KEY
    });

    // Update exchange with candidate response and scores
    db.updateExchange(exchangeId, {
      candidate_answer: answerText || '',
      answer_duration_seconds: durationSeconds,
      scores: evaluation.scores,
      evaluation: evaluation
    });

    // 2. Determine Next Step (Next Question in Level, Next Level, or Complete Interview)
    const currentLevel = exchange.level;
    const currentQIndex = exchange.question_index;
    const totalQuestionsPerLevel = 2; // 2 questions per level = 6 total questions for comprehensive coverage

    let nextLevel = currentLevel;
    let nextQIndex = currentQIndex + 1;
    let isInterviewComplete = false;

    if (nextQIndex >= totalQuestionsPerLevel) {
      if (currentLevel < 3) {
        nextLevel = currentLevel + 1;
        nextQIndex = 0;
        db.updateInterview(interviewId, { current_level: nextLevel });
      } else {
        isInterviewComplete = true;
      }
    }

    // Retrieve full exchange history for this interview
    const allExchanges = db.getExchangesForInterview(interviewId);

    let nextQuestion = null;
    let finalReport = null;

    if (!isInterviewComplete) {
      const history = allExchanges.map(ex => ({
        question: ex.question_text,
        answer: ex.candidate_answer
      }));

      nextQuestion = await generateNextQuestion({
        level: nextLevel,
        questionIndex: nextQIndex,
        totalQuestionsInLevel: totalQuestionsPerLevel,
        roleAnalysis,
        candidateAnalysis,
        conversationHistory: history,
        lastAnswer: answerText,
        apiKey: GEMINI_API_KEY
      });

      const nextExchangeId = uuidv4();
      db.addExchange({
        id: nextExchangeId,
        interview_id: interviewId,
        level: nextLevel,
        question_index: nextQIndex,
        competency: nextQuestion.competency,
        question_text: nextQuestion.questionText
      });

      nextQuestion.exchangeId = nextExchangeId;
      nextQuestion.level = nextLevel;
      nextQuestion.questionIndex = nextQIndex;
    } else {
      // 3. Interview complete -> Generate Final Performance Report
      finalReport = await generateFinalReport({
        roleAnalysis,
        candidateAnalysis,
        exchanges: allExchanges,
        apiKey: GEMINI_API_KEY
      });

      db.updateInterview(interviewId, {
        status: 'completed',
        overall_score: finalReport.overallScore,
        report: finalReport
      });
    }

    const levelNames = {
      1: 'Screening Interview',
      2: 'Competency & Practical Knowledge',
      3: 'Deep Dive & Architecture Scenarios'
    };

    res.json({
      evaluation,
      isLevelCompleted: nextQIndex === 0 && nextLevel > currentLevel,
      isInterviewComplete,
      currentLevel: nextLevel,
      levelName: levelNames[nextLevel],
      nextQuestion,
      finalReport
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit answer.' });
  }
});

// End or Pause Interview early and generate report
app.post('/api/interviews/:id/finish', async (req, res) => {
  try {
    const interviewId = req.params.id;
    const interview = db.getInterview(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    const session = db.getSession(interview.session_id);
    const roleAnalysis = session.role_analysis;
    const candidateAnalysis = session.candidate_analysis;

    const exchanges = db.getExchangesForInterview(interviewId);

    const finalReport = await generateFinalReport({
      roleAnalysis,
      candidateAnalysis,
      exchanges,
      apiKey: GEMINI_API_KEY
    });

    db.updateInterview(interviewId, {
      status: 'completed',
      overall_score: finalReport.overallScore,
      report: finalReport
    });

    res.json({
      interviewId,
      status: 'completed',
      finalReport
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Interview Details and Full History
app.get('/api/interviews/:id', async (req, res) => {
  try {
    const interviewId = req.params.id;
    const interview = db.getInterview(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    const session = db.getSession(interview.session_id);
    const exchanges = db.getExchangesForInterview(interviewId);

    res.json({
      interview,
      session: {
        candidateName: session.candidate_name,
        jobTitle: session.job_title,
        jobFitScore: session.job_fit_score,
        roleAnalysis: session.role_analysis,
        candidateAnalysis: session.candidate_analysis
      },
      exchanges: exchanges.map(ex => ({
        id: ex.id,
        level: ex.level,
        questionIndex: ex.question_index,
        competency: ex.competency,
        questionText: ex.question_text,
        candidateAnswer: ex.candidate_answer,
        durationSeconds: ex.answer_duration_seconds,
        scores: ex.scores || null,
        evaluation: ex.evaluation || null,
        timestamp: ex.timestamp
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// All Past Interviews History
app.get('/api/interviews', async (req, res) => {
  try {
    const rows = db.getAllInterviews();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI Interview Accelerator Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ AI Mode: ${GEMINI_API_KEY ? 'Gemini 1.5 Flash' : 'Deterministic Contextual AI Engine'}`);
  console.log(`💾 Persistence: Pure-JS JSON File Database (Zero C++ Build Tools Required)`);
  console.log(`=======================================================`);
});
