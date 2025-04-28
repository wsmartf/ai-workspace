import asyncio
import json
from pathlib import Path
from models.thread import Thread
from models.chat_message import ChatMessage
from api.ai import chat_completion
from models.chat_request import ChatRequest
from models.send_message_request import SendMessageRequest


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
    return threads


def save_thread(thread: Thread):
    """Save a thread to data/threads/thread-{id}.json."""
    path = Path("data/threads") / f"thread-{thread.id}.json"
    with open(path, "w") as f:
        json.dump(thread.model_dump(), f)
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

    # Create a new thread object
    new_thread = Thread(
        id=new_thread_id,
        title=title,
        messages=messages,
        created_at="2023-10-01T00:00:00Z",
        last_active_at="2023-10-01T00:00:00Z",
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
    # Load the existing thread
    thread = get_thread(id)
    if isinstance(thread, dict) and "error" in thread:
        return thread  # Return error if thread not found

    # Update the thread's attributes
    if title is not None:
        thread.title = title
    if messages is not None:
        thread.messages = [ChatMessage(**msg) for msg in messages]
    if document_id is not None:
        thread.document_id = document_id

    # Save the updated thread to a file
    save_thread(thread)

    return thread

async def send_dummy_message(id: int, message: str) -> Thread:
    """Simulate sending a message and return a dummy response."""
    # Load the existing thread
    thread = get_thread(id)
    new_message = ChatMessage(
        content=message,
        role="user",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(new_message)

    # Simulate a delay and return a dummy response
    await asyncio.sleep(5)
    dummy_response = "This is a dummy message"
    assistant_message = ChatMessage(
        content=dummy_response,
        role="assistant",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(assistant_message)
    thread.last_active_at = "2023-10-01T00:00:00Z"

    # Save the updated thread to a file
    save_thread(thread)
    return thread

async def send_message(id: int, message: str) -> Thread:
    # Load the existing thread
    thread = get_thread(id)
    new_message = ChatMessage(
        content=message,
        role="user",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(new_message)

    # Send req to the LLM
    req = ChatRequest(
        document="test document content",
        messages=thread.messages,
    )
    response = await chat_completion(req)
    assistant_message = ChatMessage(
        content=response,
        role="assistant",
        created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(assistant_message)
    thread.last_active_at = "2023-10-01T00:00:00Z"

    # Save the updated thread to a file
    save_thread(thread)
    return thread


def delete_thread(id: int):
    """Delete a thread from data/threads/thread-{id}.json."""
    path = Path("data/threads") / f"thread-{id}.json"
    if path.exists():
        path.unlink()  # Delete the file
        return
    else:
        raise FileNotFoundError(f"Thread {id} not found.")


"""Branch the thread at the first message index."""


def branch_thread(parent_thread_id: int, last_message_index: int) -> Thread:
    """Branch a thread at the first message index."""
    parent_thread = get_thread(parent_thread_id)
    new_thread(
        title=parent_thread.title,
        messages=parent_thread.messages[0 : last_message_index + 1].copy(),
        document_id=parent_thread.document_id,
    )


if __name__ == "__main__":
    pass
