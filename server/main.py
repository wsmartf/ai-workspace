# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai import ChatRequest, chat_completion, edit_document

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
    response = await chat_completion(req)
    return {"reply": response}

@app.post("/edit")
async def edit(req: ChatRequest):
    return await edit_document(req)