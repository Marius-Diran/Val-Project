import os
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv(override=True)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
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
    stream = client.chat.completions.create(
        model="openai/gpt-oss-20b:free",
        messages= [
            {"role": "system", "content": "Write short, heartfelt romantic love notes."},
            {"role": "user", "content": "Write a short romantic love note. End the note with: [SIGNATURE]"}
        ],
        stream=True,
        temperature=0.7,
        max_tokens=1000,
    )

    def event_stream():
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content: 
                yield content

    return StreamingResponse(event_stream(), media_type="text/plain")