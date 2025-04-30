from pydantic import BaseModel
from typing import Optional
from models.doc import Document
from models.thread import Thread

class SendMessageRequest(BaseModel):
    content: str
    mode: str  # mode: edit or ask


class SendMessageResponse(BaseModel):
    thread: Thread
    document: Optional[Document] = None