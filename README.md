# Robyyn - AI-Powered Interview Platform

A full-stack interview platform that conducts interactive mock interviews with video recording, audio transcription, and AI-powered question delivery.

## Features

- **Landing Page**: Dark-themed hero section showcasing the Robyyn AI platform
- **Interactive Interview**: 
  - Role-based question selection (Product Engineer, Site Reliability Engineer)
  - Video streaming with webcam preview
  - Text-to-speech question reading
  - Audio recording of candidate responses
  - Speech-to-text transcription using OpenAI Whisper
  - Transcript storage and display

## Tech Stack

**Frontend:**
- React 19.2.4
- React Router DOM 7.13.0
- CSS3
- MediaRecorder API

**Backend:**
- FastAPI
- pyttsx3 (Text-to-speech)
- OpenAI Whisper (Speech-to-text)
- ffmpeg (Audio format conversion)

## Prerequisites

### System Requirements
- **Node.js**: 14+ (for frontend)
- **Python**: 3.8+ (for backend)
- **ffmpeg**: Required for audio format conversion


## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mav01-code/Assignment
cd Assignment
```

### 2. Backend Setup

#### Install Dependencies
```bash
pip install fastapi uvicorn python-dotenv openai-whisper ffmpeg-python pyttsx3 python-multipart
```

#### Run the Backend Server
```bash
cd backend
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

**API Documentation:** Visit `http://localhost:8000/docs` for interactive Swagger UI

### 3. Frontend Setup

#### Commands and installation
```bash
cd frontend
npm install
npm start
```

The frontend will open at `http://localhost:3000`


1. **Landing Page**: Opens at `http://localhost:3000`
   - Click "Get Started" button to enter interview

2. **Interview Page**:
   - Select a role (Product Engineer or Site Reliability Engineer)
   - Click "Start Interview"
   - Allow camera and microphone permissions
   - Listen to the first question (spoken via TTS)
   - Click "Start Recording Answer" to record your response
   - Speak your answer clearly
   - Click "Stop Recording" when done
   - Your answer will be transcribed and displayed
   - Click "Next Question" to proceed
   - Click "End Interview" to finish