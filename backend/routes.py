from fastapi import UploadFile, APIRouter, File, HTTPException
import os
import shutil

from service import(
    get_questions,
    speak_question,
    get_answer
)

router = APIRouter()

@router.get("/questions/{role}")
def fetch_questions(role: str):
    questions = get_questions(role)
    if not questions:
        raise HTTPException(status_code = 404, detail = "Role not found")
    return {"role": role, "questions": questions}

@router.post("/speak")
def speak(q: str):
    speak_question(q)
    return {"You can answer now."}

@router.post("/audio")
async def upload(file: UploadFile = File(...)):
    os.makedirs("audiofiles", exist_ok=True)
    with open("audiofiles/answer.wav", "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"Note": "Uploaded"}

@router.post("transcribe")
def transcribe():
    audio = "audiofiles/answer.wav"

    if not os.path.exists(audio):
        raise HTTPException(status_code = 400, detail = "Audio not found")
    transcript = get_answer(audio)
    with open("transcript/answers.txt", "a") as f:
        f.write(transcript + "\n")
    return {"transcript": transcript}

@router.get("/score")
def fetch_grade(score):
    return "400"