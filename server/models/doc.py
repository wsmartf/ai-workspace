from pydantic import BaseModel, Field

class Document(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
    last_active_at: str
    linked_threads: list[int]
    linked_nodes: list[int]
