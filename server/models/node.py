# models/node.py
from pydantic import BaseModel
from typing import List, Optional


class Node(BaseModel):
    id: int
    title: str
    content: str
    related_nodes: List[int] = []
    related_docs: List[int] = []
    related_threads: List[int] = []
    created_at: str
    updated_at: str
    tags: List[str] = []
