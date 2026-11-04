const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, 'interview_accelerator.json');

// Initialize database file if not present
function loadData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { sessions: [], interviews: [], exchanges: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON DB, reinitializing:', err);
    return { sessions: [], interviews: [], exchanges: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB:', err);
  }
}

module.exports = {
  // Session operations
  saveSession: (session) => {
    const data = loadData();
    data.sessions = data.sessions.filter(s => s.id !== session.id);
    data.sessions.push({ ...session, created_at: new Date().toISOString() });
    saveData(data);
    return session;
  },

  getSession: (id) => {
    const data = loadData();
    return data.sessions.find(s => s.id === id) || null;
  },

  // Interview operations
  createInterview: (interview) => {
    const data = loadData();
    const record = {
      ...interview,
      created_at: new Date().toISOString(),
      status: interview.status || 'in_progress',
      current_level: interview.current_level || 1,
      overall_score: null,
      report: null
    };
    data.interviews.push(record);
    saveData(data);
    return record;
  },

  getInterview: (id) => {
    const data = loadData();
    return data.interviews.find(i => i.id === id) || null;
  },

  updateInterview: (id, updates) => {
    const data = loadData();
    const idx = data.interviews.findIndex(i => i.id === id);
    if (idx !== -1) {
      data.interviews[idx] = { ...data.interviews[idx], ...updates };
      saveData(data);
      return data.interviews[idx];
    }
    return null;
  },

  getAllInterviews: () => {
    const data = loadData();
    return data.interviews.map(i => {
      const session = data.sessions.find(s => s.id === i.session_id) || {};
      return {
        id: i.id,
        created_at: i.created_at,
        status: i.status,
        overall_score: i.overall_score,
        current_level: i.current_level,
        candidate_name: session.candidate_name || 'Candidate',
        job_title: session.job_title || 'Software Engineer',
        job_fit_score: session.job_fit_score || 0
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Exchange operations
  addExchange: (exchange) => {
    const data = loadData();
    const record = {
      ...exchange,
      timestamp: new Date().toISOString()
    };
    data.exchanges.push(record);
    saveData(data);
    return record;
  },

  getExchange: (id) => {
    const data = loadData();
    return data.exchanges.find(e => e.id === id) || null;
  },

  updateExchange: (id, updates) => {
    const data = loadData();
    const idx = data.exchanges.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.exchanges[idx] = { ...data.exchanges[idx], ...updates };
      saveData(data);
      return data.exchanges[idx];
    }
    return null;
  },

  getExchangesForInterview: (interviewId) => {
    const data = loadData();
    return data.exchanges
      .filter(e => e.interview_id === interviewId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
};
