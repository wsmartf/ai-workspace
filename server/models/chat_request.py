from pydantic import BaseModel
from models.chat_message import ChatMessage



class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    document: str