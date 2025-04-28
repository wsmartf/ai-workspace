from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body, Query
from api.memory import add_memory_item
from api import threads, docs
from models.send_message_request import SendMessageRequest
from models.thread_request import NewThreadRequest, UpdateThreadRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/memory/add")
async def add_to_memory(
    title: str = Body(...), content: str = Body(...), tags: List[str] = Body(default=[])
):
    item = add_memory_item(title, content, tags)
    return {"status": "ok", "item": item}


@app.get("/threads/{id}")
async def get_thread(id: int):
    return threads.get_thread(id).model_dump()


@app.get("/threads")
async def get_all_threads():
    return threads.get_all_threads()


@app.get("/documents/{id}")
async def get_document(id: int):
    return docs.get_document(id).model_dump()


@app.post("/threads")
async def new_thread(
    req: NewThreadRequest = Body(...),
):
    thread = threads.new_thread(
        req.title,
        req.messages,
        req.document_id,
    )
    return thread.model_dump()


@app.post("/threads/{id}")
async def update_thread(
    req: UpdateThreadRequest = Body(...),
):
    thread = threads.update_thread(
        req.id,
        req.title,
        req.messages,
        req.document_id,
    )
    return thread.model_dump()


@app.post("/threads/{id}/messages")
async def send_message(
    id: int,
    message_request: SendMessageRequest = Body(...),
    demo: bool = Query(default=False),
):
    if demo:
        thread = await threads.send_dummy_message(id, message_request.content)
    else:
        thread = await threads.send_message(id, message_request.content)
    return thread.model_dump()


@app.delete("/threads/{id}")
async def delete_thread(id: int):
    threads.delete_thread(id)
    return {"status": "ok"}
