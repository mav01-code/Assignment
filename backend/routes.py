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
    file_path = "audiofiles/answer.webm"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"Note": "Uploaded"}

@router.post("/transcribe")
def transcribe():
    audio_input = "audiofiles/answer.webm"
    audio_output = "audiofiles/answer.wav"

    if not os.path.exists(audio_input):
        raise HTTPException(status_code = 400, detail = "Audio not found")
    try:
        transcript = get_answer(audio_input, audio_output)
        os.makedirs("transcript", exist_ok=True)
        with open("transcript/answers.txt", "a") as f:
            f.write(transcript + "\n")
        return {"transcript": transcript}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(exc)}")

@router.get("/score")
def fetch_grade(score):
    return "400"