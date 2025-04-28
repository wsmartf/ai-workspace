from pydantic import BaseModel, Field
from typing import Optional, List
from models.chat_message import ChatMessage

class Thread(BaseModel):
    id: int
    title: str
    messages: List[ChatMessage]
    created_at: str
    last_active_at: str
    document_id: Optional[int]