import json
import pyttsx3
import whisper
import os
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

def speak_question(question):
    print(question)
    engine.say(question)
    engine.runAndWait()

model = whisper.load_model("base")

def stt(audiofile):
    os.makedirs("audiofiles", exist_ok = True)
    os.makedirs("transcript", exist_ok=True)
    (ffmpeg.input(audiofile).output(audiofile, ac = 1, ar = 16000).overwrite_output().run(quiet = True))
    res = model.transcribe(audiofile)
    transcript = res["text"]
    return transcript

def get_answer(audio):
    return stt(audio)