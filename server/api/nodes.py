from models.node import Node
import logging
from pathlib import Path
import json
from models.thread import Thread
from api.docs import get_document
from datetime import datetime, timezone
from api.ai import gen_node_content
import asyncio


log = logging.getLogger(__name__)


def is_node_exists(id: int) -> bool:
    """Check if a node exists by its ID."""
    path = Path("data/nodes") / f"node-{id}.json"
    return path.exists()


def get_node(
    id: int,
) -> Node:
    """Get a node by its ID."""
    log.info(f"Getting thread node {id}")
    path = Path("data/nodes") / f"node-{id}.json"
    if not path.exists():
        raise FileNotFoundError(f"Node {id} not found")
    with open(path, "r") as f:
        node = Node(**json.load(f))
    return node


def save_node(node: Node):
    """Save a node to data/nodes/node-{id}.json."""
    path = Path("data/nodes") / f"node-{node.id}.json"
    with open(path, "w") as f:
        json.dump(node.model_dump(), f, indent=4)


def create_node(
    title: str,
    content: str,
    related_nodes: list[int] = [],
    related_docs: list[int] = [],
    related_threads: list[int] = [],
    tags: list[str] = [],
) -> Node:
    """Create a new node and save it to data/nodes/node-{id}.json."""
    path = Path("data/nodes") / "last_node_id.txt"
    if path.exists():
        with open(path, "r") as f:
            last_node_id = int(f.read().strip())
    else:
        last_node_id = 0

    # Increment the node ID for the new node
    new_node_id = last_node_id + 1

    created_at = datetime.now(timezone.utc).isoformat()
    # Create a new node object
    new_node = Node(
        id=new_node_id,
        title=title,
        content=content,
        related_nodes=related_nodes,
        related_docs=related_docs,
        related_threads=related_threads,
        tags=tags,
        created_at=created_at,
        updated_at=created_at,
    )

    # Save the new node to a file
    save_node(new_node)

    # Update the last node ID file
    with open(path, "w") as f:
        f.write(str(new_node_id))

    return new_node


def update_node(
    id: int,
    title: str,
    content: str,
    related_nodes: list[int] = [],
    related_docs: list[int] = [],
    related_threads: list[int] = [],
    tags: list[str] = [],
) -> Node:
    """Update an existing node."""
    node = get_node(id)
    node.title = title
    node.content = content
    node.related_nodes = related_nodes
    node.related_docs = related_docs
    node.related_threads = related_threads
    node.tags = tags
    node.updated_at = datetime.now(timezone.utc).isoformat()

    save_node(node)

    return node
