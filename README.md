# Tata Assignment: Enterprise Sentiment Analyzer

![Enterprise Dashboard](https://img.shields.io/badge/Enterprise-Dashboard-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF4F00?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_LPU-Accelerated-f55036?style=for-the-badge)

A cutting-edge, full-stack Enterprise Sentiment Analysis Dashboard built for the Tata Assignment. 
This application leverages a dynamic **LangGraph workflow** powered by **Groq's LLaMA 3.1 8B** model to analyze raw customer service conversations, extract actionable insights, and render them in a stunning glassmorphism React dashboard.

## 🌟 Key Features

- **Automated PII Redaction:** Automatically scrubs emails and phone numbers before AI processing to ensure enterprise data compliance.
- **Lightning-Fast AI (Groq LPU):** Uses the Groq Cloud API for near-instantaneous inference and complex structured JSON parsing.
- **Deep Sentiment Breakdown:** Extracts overall sentiment, sentence-level timelines, and specific detected emotions (Frustration, Relief, Anger, etc.).
- **Automated KPI Extraction:** Automatically identifies impacted employees, network packet loss, connection drops, and conversation durations.
- **Agent Quality Scoring:** Dynamically evaluates the support agent out of 100 on Empathy, Problem Identification, and Resolution.
- **Stunning UI/UX:** A robust Next.js frontend built with Recharts, CSS grid interlocking, and premium glassmorphism styling.
- **Report Generation:** Export the complete LLM analysis into a clean text document with one click.

---

## 🏗️ Architecture

### Backend: FastAPI & LangGraph
The backend is a state-machine orchestrator built in Python. 
1. **Security Node:** Scans for prompt injection attacks.
2. **PII Redaction Node:** Cleans the text using regex.
3. **Analysis Node:** Forces the LLM (via Groq) to conform to a massive Pydantic schema using constrained decoding.
4. **Evaluation Node:** (Optional) Uses DeepEval to score the relevance of the AI's summary.

### Frontend: Next.js & Recharts
The frontend polls the backend asynchronously and utilizes 5 distinct charts to visualize the nested arrays returned by the AI pipeline.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python 3.12+
- A Free Groq API Key ([console.groq.com](https://console.groq.com/keys))

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run the FastAPI Server
uvicorn main:app --reload --port 8000
```

> **Note:** Ensure you create a `.env` file in the `backend/` directory with your `GROQ_API_KEY` and `LLM_MODEL=llama-3.1-8b-instant`.

### 2. Frontend Setup

```bash
cd frontend

# Install Dependencies
npm install

# Run the Next.js Development Server
npm run dev
```

The frontend will be running at `http://localhost:3000`. 
Log in with any credentials (e.g., `admin` / `admin123`) to access the dashboard and upload your text files!

---

## 📄 License
This project was built for the Tata Assignment.
