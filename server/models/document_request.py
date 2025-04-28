from pydantic import BaseModel
from typing import Optional


class NewDocumentRequest(BaseModel):
    title: str
    content: str
    linked_threads: Optional[list[int]] = []
    linked_nodes: Optional[list[int]] = []


class UpdateDocumentRequest(BaseModel):
    id: int
    title: Optional[str] = None
    content: Optional[str] = None
    linked_threads: Optional[list[int]] = None
    linked_nodes: Optional[list[int]] = None
