# AI Interview Accelerator 🚀

A production-grade, AI-powered career acceleration and adaptive mock interview platform built for high-stakes technical and behavioral hiring rounds.

The platform takes any **Job Description (JD)** and **Candidate Resume (PDF, DOCX, or TXT)**, conducts automated competency extraction, scores initial job fit, guides the candidate through a **3-level adaptive voice interview**, and generates an executive bar-raiser report with evidence-based scoring and a study plan.

---

## 🌟 Key Features

1. **Document Processing & Validation:**
   - Multi-format ingestion: **PDF**, **DOCX**, and **TXT** with text extraction (`pdf-parse`, `mammoth`).
   - Handles edge cases: oversized files (up to 25MB), empty files, or corrupted formatting.
   - Sample production JD & resume included for instant one-click testing.

2. **AI Role Diagnostic:**
   - Parses responsibilities, required and preferred skills, core competencies, and critical keywords.

3. **Candidate Analysis & Explainable Job Fit (0–100):**
   - Matches candidate evidence directly to the JD.
   - Highlights strong matches, partial matches, missing competencies, and interrogates questionable resume claims without inventing experience.

4. **3-Level Adaptive Live AI Interview:**
   - **Level 1 (Screening):** Motivation, career trajectory, resume claims, communication, and culture fit.
   - **Level 2 (Competency):** Deep technical skills, production debugging, API hygiene, and behavioral trade-offs.
   - **Level 3 (Deep Dive):** High-scale system design, eventual consistency, edge cases, and pushback scenarios.
   - Dynamically adapts questions based on candidate brevity or depth.

5. **Voice-First Interaction (STT & TTS):**
   - Browser-native **Speech Synthesis (TTS)** speaks interview questions aloud.
   - Browser-native **Speech Recognition (STT)** transcribes candidate answers in real time.
   - Audio re-play, microphone toggles, and fallback manual text editor ensure seamless operation regardless of device permissions.
   - Self-view video camera preview mirror for realistic simulation.

6. **Bar-Raiser Performance Report:**
   - Overall Score (0–100) and Readiness Classification: *Strong Candidate*, *Interview Ready*, *Needs Preparation*, *Not Ready*.
   - 7-Dimension breakdown: Role Fit, Technical Knowledge, Problem Solving, Communication, Observable Confidence, Depth of Understanding, Behavioral Fit.
   - Question-by-question scoring, what was good, what was missing, how to improve, and model answer structure.
   - Prioritized study roadmap with estimated preparation hours.

7. **SQLite Database Persistence:**
   - Stores sessions, role analyses, live interview exchanges, answers, scores, and past reports.

---

## 🏗️ Architecture & Tech Stack

- **Backend:** Node.js, Express, SQLite3, Multer, `pdf-parse`, `mammoth`, `uuid`
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Voice / Speech:** Browser Speech Recognition & Speech Synthesis with fallback controls
- **AI Engine:** Configurable Google Gemini 1.5 API with a contextual, deterministic fallback engine for offline reliability.

---

## 📋 Prerequisites

- **Node.js**: v18.x or higher (`node -v`)
- **npm**: v9.x or higher (`npm -v`)

---

## ⚡ Installation & Execution Guide

### 1. Install Backend Dependencies
Run in the project root:
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Optional: Add your Google Gemini API key if available
# If left empty, the built-in deterministic AI engine provides realistic context-grounded evaluations
GEMINI_API_KEY=
PORT=5000
```

### 4. Start the Application

#### Terminal 1 — Start the Backend Server:
```bash
node server.js
```
*The backend starts at `http://localhost:5000` with the SQLite database initialized.*

#### Terminal 2 — Start the Frontend Dev Server:
```bash
cd frontend
npm run dev
```
*The frontend will run at `http://localhost:5173` (or the port specified by Vite).*

---

## 🧪 Testing the User Journey

1. Open `http://localhost:5173` in Google Chrome or Microsoft Edge.
2. Click **"Launch Interview Accelerator"**.
3. Click **"Load Production Sample (Senior Full-Stack)"** to automatically populate a realistic Senior Engineer JD and Resume.
4. Click **"Analyze Match & Generate Diagnostic"**.
5. Review the extracted **Role Analysis** and **Candidate Diagnostic (Job Fit Score)**.
6. Click **"Setup Adaptive Interview"**, verify your microphone/speakers, and enter the **Live Room**.
7. Engage with the AI interviewer using voice or text.
8. Answer the questions across all 3 levels (Screening, Competency, Deep Dive).
9. Conclude to view the **Executive Bar-Raiser Report**, 7-dimension competency radar, study plan, and question-by-question breakdown.
10. Check **"History"** in the top navigation to see previous sessions saved in SQLite.

