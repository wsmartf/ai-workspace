import json
from pathlib import Path
from models.doc import Document


def get_document(id: int) -> Document:
    """Load a document from data/docs/doc-{id}.json, and return it as a dict."""
    path = Path("data/docs") / f"doc-{id}.json"
    if not path.exists():
        raise FileNotFoundError(f"Document {id} not found")

    with open(path, "r") as f:
        document_data = json.load(f)

    # Convert the loaded data into a Document object
    return Document(**document_data)


def save_document(document: Document):
    """Save a document to data/docs/doc-{id}.json."""
    path = Path("data/docs") / f"doc-{document.id}.json"
    with open(path, "w") as f:
        json.dump(document.model_dump(), f, indent=4)


def get_all_documents() -> list[dict]:
    """Load all documents from data/docs/*.json"""
    documents = []
    path = Path("data/docs")
    for file in path.glob("*.json"):
        with open(file, "r") as f:
            document_data = json.load(f)
            document = Document(**document_data)
            documents.append(document.model_dump())
    return documents


def create_document(
    title: str,
    content: str,
    linked_threads: list[int] = [],
    linked_nodes: list[int] = [],
) -> Document:
    """Create a new document and save it to data/docs/doc-{id}.json."""
    path = Path("data/docs") / "last_doc_id.txt"
    if path.exists():
        with open(path, "r") as f:
            last_doc_id = int(f.read().strip())
    else:
        last_doc_id = 0

    # Increment the document ID for the new document
    new_doc_id = last_doc_id + 1

    # Create a new document object
    new_document = Document(
        id=new_doc_id,
        title=title,
        content=content,
        created_at="2023-10-01T00:00:00Z",  # Placeholder for actual timestamp
        last_modified_at="2023-10-01T00:00:00Z",  # Placeholder for actual timestamp
        linked_threads=linked_threads,
        linked_nodes=linked_nodes,
    )

    # Save the new document
    save_document(new_document)

    # Update the last document ID
    with open(path, "w") as f:
        f.write(str(new_doc_id))
    return new_document


def update_document(
    id: int,
    title: str = None,
    content: str = None,
    linked_threads: list[int] = None,
    linked_nodes: list[int] = None,
) -> Document:
    """Update an existing document."""
    document = get_document(id)

    if title:
        document.title = title
    if content:
        document.content = content
    if linked_threads is not None:
        document.linked_threads = linked_threads
    if linked_nodes is not None:
        document.linked_nodes = linked_nodes
    document.last_modified_at = (
        "2023-10-01T00:00:00Z"  # Placeholder for actual timestamp
    )
    save_document(document)
    return document

def delete_document(id: int):
    """Delete a document."""
    path = Path("data/docs") / f"doc-{id}.json"
    if path.exists():
        path.unlink()
    else:
        raise FileNotFoundError(f"Document {id} not found")