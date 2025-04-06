from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai import chat_completion, edit_document
from fastapi import Body
from memory import add_memory_item
from structs import ChatRequest

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

@app.post("/memory/add")
async def add_to_memory(
    title: str = Body(...),
    content: str = Body(...),
    tags: List[str] = Body(default=[])
):
    item = add_memory_item(title, content, tags)
    return { "status": "ok", "item": item }
