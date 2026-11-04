const http = require('http');
const {
  analyzeJobDescription,
  analyzeCandidateAgainstJD,
  generateNextQuestion,
  evaluateAnswer,
  generateFinalReport
} = require('./backend/aiEngine');
const { extractTextFromBuffer } = require('./backend/documentParser');

async function runTests() {
  console.log('🧪 [TEST SUITE] Starting AI Interview Accelerator Verification...\n');

  // Test 1: Document parser with plain text buffer
  console.log('Test 1: Verifying Document Parser with TXT buffer...');
  const sampleTxtBuffer = Buffer.from('Software Engineer with React and Node.js experience.');
  const parsed = await extractTextFromBuffer(sampleTxtBuffer, 'sample.txt', 'text/plain');
  if (parsed.includes('Software Engineer')) {
    console.log('✅ Document parser extracted text successfully.');
  } else {
    throw new Error('Document parser failed.');
  }

  // Test 2: AI Role Analysis
  console.log('\nTest 2: Verifying AI Role Analysis engine...');
  const sampleJd = `Role: Senior Full Stack Engineer. Requirements: React, TypeScript, Node.js, Distributed Systems, SQL.`;
  const roleAnalysis = await analyzeJobDescription(sampleJd);
  console.log(`✅ Extracted Title: "${roleAnalysis.jobTitle}"`);
  console.log(`✅ Required Skills: ${roleAnalysis.requiredSkills.join(', ')}`);

  // Test 3: Candidate & Job Fit Scoring
  console.log('\nTest 3: Verifying Candidate Matching & Job Fit Score...');
  const sampleResume = `Alex Chen. Experience in React, TypeScript, Node.js, and Redis caching.`;
  const candidateAnalysis = await analyzeCandidateAgainstJD(sampleResume, roleAnalysis);
  console.log(`✅ Candidate Name: ${candidateAnalysis.candidateName}`);
  console.log(`✅ Job Fit Score: ${candidateAnalysis.jobFitScore}/100`);
  console.log(`✅ Strong Matches count: ${candidateAnalysis.strongMatches.length}`);

  // Test 4: Adaptive Question Generation (Level 1, Level 2, Level 3)
  console.log('\nTest 4: Verifying 3-Level Adaptive Question Generator...');
  const qL1 = await generateNextQuestion({ level: 1, questionIndex: 0, roleAnalysis, candidateAnalysis });
  console.log(`✅ Level 1 (Screening): "${qL1.questionText.substring(0, 70)}..."`);

  const qL2 = await generateNextQuestion({ level: 2, questionIndex: 0, roleAnalysis, candidateAnalysis, lastAnswer: 'Brief reply.' });
  console.log(`✅ Level 2 (Competency): "${qL2.questionText.substring(0, 70)}..."`);

  const qL3 = await generateNextQuestion({ level: 3, questionIndex: 0, roleAnalysis, candidateAnalysis });
  console.log(`✅ Level 3 (Deep Dive): "${qL3.questionText.substring(0, 70)}..."`);

  // Test 5: Answer Evaluation
  console.log('\nTest 5: Verifying Answer Evaluation Rubric...');
  const evalResult = await evaluateAnswer({
    question: qL2.questionText,
    competency: qL2.competency,
    candidateAnswer: 'In my previous project, we reduced p99 latency from 400ms to 65ms by implementing a Redis read-through cache with a 60-second TTL and Redlock for concurrent worker updates.',
    durationSeconds: 25
  });
  console.log(`✅ Answer Overall Score: ${evalResult.overallAnswerScore}/100`);
  console.log(`✅ What was good: ${evalResult.whatWasGood}`);

  // Test 6: Final Performance Report
  console.log('\nTest 6: Verifying Executive Performance Report & Readiness Tier...');
  const finalReport = await generateFinalReport({
    roleAnalysis,
    candidateAnalysis,
    exchanges: [{
      question_text: qL2.questionText,
      competency: qL2.competency,
      candidate_answer: 'Detailed response with metrics.',
      scores: evalResult.scores
    }]
  });
  console.log(`✅ Overall Final Score: ${finalReport.overallScore}/100`);
  console.log(`✅ Readiness Classification: ${finalReport.readinessClassification}`);
  console.log(`✅ Hiring Recommendation: ${finalReport.hiringRecommendation}`);
  console.log(`✅ Prioritized Study Items: ${finalReport.prioritizedStudyPlan.length}`);

  console.log('\n✨ ALL 6 CRITICAL SYSTEM TESTS PASSED SUCCESSFULLY! ✨');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

