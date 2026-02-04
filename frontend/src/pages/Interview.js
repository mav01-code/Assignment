import React, { useState, useRef, useEffect } from "react";
import "../styles/Interview.css";

function Interview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const roles = ["Product Engineer", "Site Reliability Engineer"];

  useEffect(() => {
    if (interviewStarted) {
      startVideoStream();
    }
  }, [interviewStarted]);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Please allow camera and microphone access to continue with the interview.");
    }
  };

  const fetchQuestions = async (selectedRole) => {
    try {
      const response = await fetch(`http://localhost:8000/questions/${selectedRole}`);
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions. Make sure the backend is running.");
    }
  };

  const speakQuestion = async (question) => {
    try {
      await fetch(`http://localhost:8000/speak?q=${encodeURIComponent(question)}`, {
        method: "POST"
      });
    } catch (error) {
      console.error("Error speaking question:", error);
    }
  };

  const startInterview = async () => {
    if (!role) {
      alert("Please select a role first!");
      return;
    }
    await fetchQuestions(role);
    setInterviewStarted(true);
  };

  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      speakQuestion(questions[currentQuestionIndex]);
    }
  }, [interviewStarted, questions, currentQuestionIndex]);

  const getSupportedMimeType = () => {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus"
    ];

    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "";
  };

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Video stream not ready!");
      return;
    }

    const stream = videoRef.current.srcObject;
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      alert("Microphone not available. Please allow microphone access.");
      return;
    }

    const audioStream = new MediaStream(audioTracks);
    const mimeType = getSupportedMimeType();
    let mediaRecorder;

    try {
      mediaRecorder = mimeType
        ? new MediaRecorder(audioStream, { mimeType })
        : new MediaRecorder(audioStream);
    } catch (error) {
      console.error("MediaRecorder not supported with this stream:", error);
      alert("Recording is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blobType = mimeType || "audio/webm";
      const audioBlob = new Blob(chunksRef.current, { type: blobType });
      await uploadAudio(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "answer.wav");

      await fetch("http://localhost:8000/audio", {
        method: "POST",
        body: formData
      });

      // Transcribe the audio
      const transcribeResponse = await fetch("http://localhost:8000/transcribe", {
        method: "POST"
      });
      const transcribeData = await transcribeResponse.json();
      setTranscript(transcribeData.transcript);

      alert("Answer recorded successfully!");
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio. Make sure the backend is running.");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTranscript("");
    } else {
      alert("Interview completed! Thank you.");
      endInterview();
    }
  };

  const endInterview = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setInterviewStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTranscript("");
  };

  return (
    <main className="interview">
      <div className="star star-1"></div>
      <div className="star star-2"></div>
      <div className="star star-3"></div>
      <div className="star star-4"></div>
      <div className="star star-5"></div>
      <div className="star star-6"></div>

      <section className="interview-content">
        {!interviewStarted ? (
          <div className="interview-setup">
            <h1>AI Interview Practice</h1>
            <p className="subtitle">Select your role and start practicing</p>
            
            <div className="role-selector">
              <label htmlFor="role-select">Choose a role:</label>
              <select 
                id="role-select"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="role-dropdown"
              >
                <option value="">-- Select Role --</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button onClick={startInterview} className="start-button">
              Start Interview
            </button>
          </div>
        ) : (
          <div className="interview-active">
            <div className="video-container">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="video-preview"
              />
            </div>

            <div className="interview-controls">
              <h2 className="current-role">{role}</h2>
              <p className="question-counter">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              
              <div className="question-box">
                <h3>Question:</h3>
                <p className="question-text">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              <div className="recording-controls">
                {!isRecording ? (
                  <button onClick={startRecording} className="record-button">
                    🎤 Start Recording Answer
                  </button>
                ) : (
                  <button onClick={stopRecording} className="stop-button">
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>

              {transcript && (
                <div className="transcript-box">
                  <h4>Your Answer:</h4>
                  <p>{transcript}</p>
                </div>
              )}

              <div className="navigation-buttons">
                <button onClick={nextQuestion} className="next-button">
                  Next Question →
                </button>
                <button onClick={endInterview} className="end-button">
                  End Interview
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Interview;