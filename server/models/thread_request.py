from typing import List
from typing import Optional
from pydantic import BaseModel


class NewThreadRequest(BaseModel):
    title: str
    messages: List[dict] = []
    document_id: Optional[int] = None


class UpdateThreadRequest(BaseModel):
    id: int
    title: Optional[str] = None
    messages: Optional[List[dict]] = None
    document_id: Optional[int] = None


class BranchThreadRequest(BaseModel):
    last_message_index: int
    title: Optional[str] = None
