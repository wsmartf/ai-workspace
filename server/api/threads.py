from datetime import datetime, timezone
import json
from pathlib import Path
from models.thread import Thread
from models.chat_message import ChatMessage
from api.ai import chat_completion, edit_document, gen_node_content
from api.docs import get_document, update_document
from models.doc import Document
from models.node import Node
import logging
from api.nodes import get_node, create_node, update_node
import asyncio

log = logging.getLogger(__name__)


def get_thread(id: int) -> Thread:
    """Load a thread from data/threads/thread-{id}.json"""
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
    """Create a new thread and save it to data/threads/thread-{id}.json.
    
    Also create a new empty node for the thread.
    """
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

    new_node = create_node(
        title=f"Empty Node for Thread {title}",
        content="",
        related_nodes=[],
        related_docs=[document_id] if document_id else [],
        related_threads=[new_thread_id],
    )

    # Update the thread with the new node ID
    new_thread.nodes = [new_node.id]

    # Save the new thread to a file
    save_thread(new_thread)

    # Update the last thread ID file
    with open(path, "w") as f:
        f.write(str(new_thread_id))

    return new_thread


def update_thread(
    id: int,
    title: str = None,
    messages: list[dict] = None,
    document_id: int = None,
    nodes: list[int] = None,
) -> Thread:
    """Update a thread and save it to data/threads/thread-{id}.json."""
    if not title and not messages and not document_id and not nodes:
        raise ValueError(
            "At least one of title, messages, document_id, or nodes must be provided."
        )

    # Load the existing thread
    thread = get_thread(id)

    # Update the thread's attributes
    if title is not None:
        thread.title = title
    if messages is not None:
        thread.messages = [ChatMessage(**msg) for msg in messages]
    if document_id is not None:
        thread.document_id = document_id
    if nodes is not None:
        thread.nodes = nodes

    # Only update last_active_at if messages were modified
    if messages is not None:
        thread.last_active_at = datetime.now(timezone.utc).isoformat()
    else:
        log.info("Skipping last_active_at update because messages were not modified.")

    # Save the updated thread to a file
    save_thread(thread)

    return thread


async def send_dummy_message(
    id: int, message: str, is_edit: bool = False
) -> tuple[Thread, Document]:
    """Mock sending a message, and add a dummy response and delay. Handle is_edit by modifying the document."""
    thread = get_thread(id)
    new_message = ChatMessage(
        content=message, role="user", created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(new_message)

    await asyncio.sleep(2)  # Simulate a delay

    dummy_response = "This is a dummy response."

    doc = None
    if is_edit and thread.document_id is not None:
        document = get_document(thread.document_id)
        timestamp = datetime.now(timezone.utc).isoformat()
        updated_content = f"MOCK EDIT - {timestamp}\n{document.content}"
        doc = update_document(thread.document_id, content=updated_content)

    assistant_message = ChatMessage(
        content=dummy_response, role="assistant", created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(assistant_message)
    thread.last_active_at = datetime.now(timezone.utc).isoformat()

    # Save the updated thread to a file
    save_thread(thread)

    return thread, doc


async def send_message(
    id: int, message: str, is_edit: bool = False
) -> tuple[Thread, Document]:
    # Load the existing thread
    thread = get_thread(id)
    new_message = ChatMessage(
        content=message, role="user", created_at="2023-10-01T00:00:00Z"
    )
    thread.messages.append(new_message)

    document_content = ""
    if thread.document_id is not None:
        document_content = get_document(thread.document_id).content

    nodes: list[Node] = [get_node(node_id) for node_id in thread.nodes]

    # Trim the messages based on the presence of nodes and their updated_at timestamps
    trimmed_messages = thread.messages  # Default to all messages
    if nodes:
        # Sort nodes by their updated_at timestamp and get the most recent one
        most_recent_node = max(nodes, key=lambda x: x.updated_at)
        # Find the index of the first message created after the most recent node
        last_message_index = next(
            (
                i
                for i, message in enumerate(thread.messages)
                if message.created_at > most_recent_node.updated_at
            ),
            len(thread.messages),
        )
        # Ensure at least the latest 5 messages are included
        start_index = max(0, min(last_message_index, len(thread.messages) - 5))
        trimmed_messages = thread.messages[start_index:]

    updated_doc = None
    message = None
    if is_edit:
        log.info(f"Editing document {thread.document_id} with message: {message}")
        resp = await edit_document(trimmed_messages, document_content, nodes)
        message = resp["message"]
        updated_doc: Document = update_document(
            thread.document_id, content=resp["document"]
        )
    else:
        log.info(f"Sending message to LLM: {message}")
        message = await chat_completion(trimmed_messages, document_content, nodes)

    assistant_message = ChatMessage(
        content=message, role="assistant", created_at="2023-10-01T00:00:00Z"
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


def branch_thread(
    parent_thread_id: int, last_message_index: int, title: str = None
) -> Thread:
    """Branch a thread at the first message index.
    
    Create a node for the child thread, and a two-way link between the the nodes (if a node exists for this thread).
    """
    parent_thread = get_thread(parent_thread_id)
    parent_nodes: list[Node] = get_thread_nodes(parent_thread_id)

    branch_thread = new_thread(
        title=title if title else get_branch_title(parent_thread.title),
        messages=parent_thread.messages[0 : last_message_index + 1].copy(),
        document_id=None,
    )
    branch_node = get_node(branch_thread.nodes[0])

    for parent_node in parent_nodes:
        # Link the parent node to the child node, if not already linked
        if branch_node.id not in parent_node.related_nodes:
            parent_node.related_nodes.append(branch_node.id)
            update_node(
                id=parent_node.id,
                related_nodes=parent_node.related_nodes,
            )
        # Link the child node to the parent node, if not already linked
        if parent_node.id not in branch_node.related_nodes:
            branch_node.related_nodes.append(parent_node.id)
            update_node(
                id=branch_node.id,
                related_nodes=branch_node.related_nodes,
            )

    return branch_thread



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
            new_title = (
                title[: match.start(1)] + f" (branch_{int(match.group(1)[1:]) + 1})"
            )
        else:
            new_title = title[: match.start()] + " (branch_2)"
    else:
        new_title = title + " (branch)"
    return new_title


def get_thread_nodes(thread_id: int) -> list[Node]:
    """Get all nodes linked to a thread."""
    log.info(f"Getting thread nodes for thread {thread_id}")
    thread = get_thread(thread_id)
    nodes = []
    for node_id in thread.nodes:
        try:
            node = get_node(node_id)
            nodes.append(node)
        except FileNotFoundError:
            log.warning(f"Node {node_id} not found")
    return nodes


async def gen_node(thread_id: int) -> Node:
    """Generate a node object.

    If node doesn't exist:
        Create a new node.
        Generate the context by calling LLM with all the thread messages + document context.
    If one exists:
        Generate the new context by calling LLM with thread messages since the last one that was
        included in the node + doc context + previous node context.
        To determine the last message, we can use the last_active_at of the thread, and compare it
        to the updated_at of the node.

    For now, assume all threads have at most 1 node. Use the first one (if it exists).
    """
    log.info(f"Generating node for thread {thread_id}")
    thread = get_thread(thread_id)
    thread_doc = get_document(thread.document_id) if thread.document_id else None
    node_docs = [thread.document_id] if thread.document_id else []

    nodes: list[Node] = get_thread_nodes(thread_id)
    if len(nodes) == 0:
        # Create a new node
        # TODO: It should never be empty, bc we create a node when creating a thread.
        resp = await gen_node_content(thread.messages, thread_doc.content)
        node = create_node(
            title=resp["title"],
            content=resp["content"],
            related_nodes=[],
            related_docs=node_docs,
            related_threads=[thread.id],
            tags=[],
        )
        # Update the thread with the new node
        update_thread(
            id=thread.id,
            nodes=[node.id],
        )
    else:
        # Update the existing node
        node = nodes[0]

        # loop through the thread messages and find the last one that was included in the node
        last_message_index = 0
        for i, message in enumerate(thread.messages):
            if message.created_at > node.updated_at:
                last_message_index = i
                break
        # Get the trimmed messages
        trimmed_messages = thread.messages[last_message_index:]

        resp = await gen_node_content(
            trimmed_messages,
            thread_doc.content,
            node.content,
        )
        update_node(
            id=node.id,
            title=resp["title"],
            content=resp["content"],
            related_nodes=node.related_nodes,
            related_docs=node.related_docs,
            related_threads=[thread.id],
            tags=node.tags,
        )
    return node


if __name__ == "__main__":
    pass
