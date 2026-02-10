from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv(override=True)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-note")
async def generate_note():
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b:free",
        messages= [
            {"role": "system", "content": "Write short, heartfelt romantic love notes."},
            {"role": "user", "content": "Write a sweet love note for my Valentine."}
        ]
    );
    return {"note": response.choices[0].message.content}