from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body, Query
from api import threads, docs
from models.send_message_request import SendMessageRequest, SendMessageResponse
from models.thread_request import (
    BranchThreadRequest,
    NewThreadRequest,
    UpdateThreadRequest,
)
import logging

from models.document_request import NewDocumentRequest

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/threads/{id}")
async def get_thread(id: int):
    return threads.get_thread(id).model_dump()


@app.get("/threads")
async def get_all_threads():
    return threads.get_all_threads()


@app.get("/documents/{id}")
async def get_document(id: int):
    return docs.get_document(id)


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


@app.put("/threads/{id}")
async def update_thread(
    id: int,
    req: UpdateThreadRequest = Body(...),
):
    thread = threads.update_thread(
        id,
        req.title,
        req.messages,
        req.document_id,
    )
    return thread.model_dump()


@app.post("/threads/{id}/messages")
async def send_message(
    id: int,
    req: SendMessageRequest = Body(...),
    demo: bool = Query(default=False),
) -> SendMessageResponse:
    if req.mode not in ["ask", "edit"]:
        raise ValueError("Invalid mode. Must be 'ask' or 'edit'.")
    is_edit = req.mode == "edit"

    # TODO: Maybe no need to return the document in the response
    if demo:
        log.info("Sending dummy message")
        thread, doc = await threads.send_dummy_message(id, req.content, is_edit=is_edit)
    else:
        thread, doc = await threads.send_message(id, req.content, is_edit=is_edit)
    return SendMessageResponse(thread=thread.model_dump(), document=doc)


@app.post("/threads/{parent_thread_id}/branch")
async def branch_thread(
    parent_thread_id: int,
    req: BranchThreadRequest = Body(...),
):
    return threads.branch_thread(
        parent_thread_id, req.last_message_index, req.title
    ).model_dump()


@app.delete("/threads/{id}")
async def delete_thread(id: int):
    threads.delete_thread(id)
    return {"status": "ok"}


@app.get("/documents")
async def get_all_documents():
    return docs.get_all_documents()


@app.get("/documents/{id}")
async def get_document(id: int):
    return docs.get_document(id).model_dump()


@app.post("/documents")
async def create_document(
    req: NewDocumentRequest = Body(...),
):
    document = docs.create_document(
        req.title,
        req.content,
        req.linked_threads,
        req.linked_nodes,
    )
    return document.model_dump()


@app.put("/documents/{id}")
async def update_document(
    id: int,
    req: NewDocumentRequest = Body(...),
):
    document = docs.update_document(
        id,
        req.title,
        req.content,
        req.linked_threads,
        req.linked_nodes,
    )
    return document.model_dump()


@app.delete("/documents/{id}")
async def delete_document(id: int):
    docs.delete_document(id)
    return {"status": "ok"}


@app.post("/threads/{thread_id}/update-node")
async def update_thread_nodes(
    thread_id: int,
):
    await threads.gen_node(thread_id)
    return {"status": "ok"}
