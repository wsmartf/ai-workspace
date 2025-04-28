from pydantic import BaseModel
from typing import List
import json
import uuid
import os

MEMORY_FILE = "../data/memory.json"


class MemoryItem(BaseModel):
    id: str
    title: str
    content: str
    tags: List[str]


def load_memory() -> List[MemoryItem]:
    if not os.path.exists(MEMORY_FILE):
        return []
    with open(MEMORY_FILE, "r") as f:
        return [MemoryItem(**item) for item in json.load(f)]


def save_memory(memory: List[MemoryItem]):
    with open(MEMORY_FILE, "w") as f:
        json.dump([item.model_dump() for item in memory], f, indent=2)


def add_memory_item(title: str, content: str, tags: List[str] = []) -> MemoryItem:
    memory = load_memory()
    new_item = MemoryItem(
        id=str(uuid.uuid4())[:8], title=title, content=content, tags=tags
    )
    memory.append(new_item)
    save_memory(memory)
    return new_item


if __name__ == "__main__":
    # Example usage
    item = add_memory_item("Test Title", "Test Content", ["tag1", "tag2"])
    print(f"Added item: {item}")

    memory_items = load_memory()

    memory_string = "\n".join(
        f"- {item.title}: {item.content}" for item in memory_items
    )

    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant working on an AI-native thinking tool.",
        },
        {
            "role": "user",
            "content": f"Here are some shared memory notes:\n{memory_string}",
        },
    ]
    print(messages)