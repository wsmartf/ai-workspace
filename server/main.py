# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai import ChatRequest, prompt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(req: ChatRequest):
    return {"reply": prompt(req)}


"""
Example HTTP request:

POST /chat HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
    "messages": [
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ]
}
"""