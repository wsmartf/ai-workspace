import asyncio
from datetime import datetime, timezone
import json
from pathlib import Path
from models.thread import Thread
from models.chat_message import ChatMessage
from api.ai import chat_completion, edit_document
from models.chat_request import ChatRequest
from models.send_message_request import SendMessageRequest, SendMessageResponse
from api.docs import get_document, update_document
from models.doc import Document
import logging

log = logging.getLogger(__name__)


def get_thread(id: int) -> Thread:
    """Load a thread from data/threads/thread-{id}.json, and return it as a dict."""
    path = Path("data/threads") / f"thread-{id}.json"
    if not path.exists():
        return {"error": "Thread not found"}

    with open(path, "r") as f:
        thread_data = json.load(f)

    # Convert the loaded data into a Thread object
    return Thread(**thread_data)


def get_all_threads() -> list[Thread]:
    """Load all threads from data/threads/*.json"""
    threads = []
    path = Path("data/threads")
    for file in path.glob("*.json"):
        with open(file, "r") as f:
            thread_data = json.load(f)
            thread = Thread(**thread_data)
            threads.append(thread.model_dump())
    
    # Sort threads by last_active_at, from oldest to newest
    threads.sort(key=lambda x: x["last_active_at"])
    return threads


def save_thread(thread: Thread):
    """Save a thread to data/threads/thread-{id}.json."""
    path = Path("data/threads") / f"thread-{thread.id}.json"
    with open(path, "w") as f:
        json.dump(thread.model_dump(), f, indent=4)
    print(f"Thread {thread.id} saved to {path}")


def new_thread(
    title: str, messages: list[ChatMessage] = [], document_id: int = None
) -> Thread:
    """Create a new thread and save it to data/threads/thread-{id}.json."""
    # Load the last thread ID from the last thread file
    path = Path("data/threads") / "last_thread_id.txt"
    if path.exists():
        with open(path, "r") as f:
            last_thread_id = int(f.read().strip())
    else:
        last_thread_id = 0

    # Increment the thread ID for the new thread
    new_thread_id = last_thread_id + 1

    created_at = datetime.now(timezone.utc).isoformat()
    # Create a new thread object
    new_thread = Thread(
        id=new_thread_id,
        title=title,
        messages=messages,
        created_at=created_at,
        last_active_at=created_at,
        document_id=document_id,
    )

    # Save the new thread to a file
    save_thread(new_thread)

    # Update the last thread ID file
    with open(path, "w") as f:
        f.write(str(new_thread_id))

    return new_thread


def update_thread(
    id: int, title: str = None, messages: list[dict] = None, document_id: int = None
) -> Thread:
    """Update a thread and save it to data/threads/thread-{id}.json."""
    if not title and not messages and not document_id:
        raise ValueError("At least one of title, messages, or document_id must be provided.")

    # Load the existing thread
    thread = get_thread(id)

    # Update the thread's attributes
    if title is not None:
        thread.title = title
    if messages is not None:
        thread.messages = [ChatMessage(**msg) for msg in messages]
    if document_id is not None:
        thread.document_id = document_id

    # Only update last_active_at if messages were modified
    if messages is not None:
        thread.last_active_at = datetime.now(timezone.utc).isoformat()
    else:
        log.info("Skipping last_active_at update because messages were not modified.")

    # Save the updated thread to a file
    save_thread(thread)

    return thread

# async def send_dummy_message(id: int, message: str) -> Thread:
#     """Simulate sending a message and return a dummy response."""
#     # Load the existing thread
#     thread = get_thread(id)
#     new_message = ChatMessage(
#         content=message,
#         role="user",
#         created_at="2023-10-01T00:00:00Z"
#     )
#     thread.messages.append(new_message)

#     # Simulate a delay and return a dummy response
#     await asyncio.sleep(5)
#     dummy_response = "This is a dummy message"
#     assistant_message = ChatMessage(
#         content=dummy_response,
#         role="assistant",
#         created_at="2023-10-01T00:00:00Z"
#     )
#     thread.messages.append(assistant_message)
#     thread.last_active_at = "2023-10-01T00:00:00Z"

#     # Save the updated thread to a file
#     save_thread(thread)
#     return thread

async def send_message(id: int, message: str, is_edit: bool = False) -> tuple[Thread, str]:
    # Load the existing thread
    thread = get_thread(id)
    new_message = ChatMessage(
        content=message,
        role="user",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(new_message)

    document_content = ""
    if thread.document_id is not None:
        document_content = get_document(thread.document_id).content

    # Send req to the LLM
    req = ChatRequest(
        document=document_content,
        messages=thread.messages,
    )
    
    updated_doc = None
    message = None
    if is_edit:
        log.info(f"Editing document {thread.document_id} with message: {message}")
        resp = await edit_document(req)
        message = resp["message"]
        updated_doc: Document = update_document(
            thread.document_id,
            content=resp["document"]
        )
    else:
        log.info(f"Sending message to LLM: {message}")
        message = await chat_completion(req)
        
    assistant_message = ChatMessage(
        content=message,
        role="assistant",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(assistant_message)
    thread.last_active_at = datetime.now(timezone.utc).isoformat()

    # Save the updated thread to a file
    save_thread(thread)

    return thread, updated_doc


def delete_thread(id: int):
    """Delete a thread from data/threads/thread-{id}.json."""
    path = Path("data/threads") / f"thread-{id}.json"
    if path.exists():
        path.unlink()  # Delete the file
        return
    else:
        raise FileNotFoundError(f"Thread {id} not found.")


"""Branch the thread at the first message index."""
def branch_thread(parent_thread_id: int, last_message_index: int, title: str = None) -> Thread:
    """Branch a thread at the first message index."""
    parent_thread = get_thread(parent_thread_id)
    return new_thread(
        title=title if title else get_branch_title(parent_thread.title),
        messages=parent_thread.messages[0 : last_message_index + 1].copy(),
        document_id=parent_thread.document_id,
    )

def get_branch_title(title: str) -> str:
    """Add ' (branch)' to the title. if it already has ' (branch)', increment the number.
    
    My Thread (branch)
    My Thread (branch_2)
    My Thread (branch_3)

    Use regex to match the pattern.
    """
    import re
    match = re.search(r" \(branch(_\d+)?\)", title)
    if match:
        if match.group(1):
            # Increment the number
            new_title = title[: match.start(1)] + f" (branch_{int(match.group(1)[1:]) + 1})"
        else:
            new_title = title[: match.start()] + " (branch_2)"
    else:
        new_title = title + " (branch)"
    return new_title


if __name__ == "__main__":
    pass
