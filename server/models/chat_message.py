from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    content: str
    role: str  # 'user' or 'assistant'
    created_at: str