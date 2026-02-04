import json
import os
import threading
import shutil
import pyttsx3
import whisper
import ffmpeg

def get_questions(role):
    file = "roles.json"
    with open(file, "r") as f:
        data = json.load(f)
    if role in data:
        return data[role]["questions"]
    else:
        return None

engine = pyttsx3.init()
engine_lock = threading.Lock()

def speak_question(question):
    print(question)
    with engine_lock:
        engine.stop()
        engine.say(question)
        engine.runAndWait()

model = whisper.load_model("base")

def stt(audio_input, audio_output):
    os.makedirs("audiofiles", exist_ok = True)
    os.makedirs("transcript", exist_ok=True)
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg is not installed or not on PATH.")
    try:
        (ffmpeg.input(audio_input).output(audio_output, ac=1, ar=16000, acodec='pcm_s16le').overwrite_output().run(quiet=True))
    except ffmpeg.Error as e:
        raise RuntimeError(f"FFmpeg conversion failed")
    except FileNotFoundError:
        raise RuntimeError("ffmpeg not found. Install ffmpeg and add to PATH.")
    except Exception as e:
        raise RuntimeError(f"Audio conversion error: {str(e)}")
    
    try:
        res = model.transcribe(audio_output)
        transcript = res["text"]
        return transcript
    except Exception as e:
        raise RuntimeError(f"Whisper transcription failed: {str(e)}")

def get_answer(audio_input, audio_output):
    return stt(audio_input, audio_output)