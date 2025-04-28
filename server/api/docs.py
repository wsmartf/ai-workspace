import json
from pathlib import Path
from models.doc import Document

def get_document(id: int):
    """Load a document from data/docs/doc-{id}.json, and return it as a dict."""
    path = Path("data/documents") / f"doc-{id}.json"
    if not path.exists():
        return {"error": "Document not found"}

    with open(path, "r") as f:
        document_data = json.load(f)

    # Convert the loaded data into a Document object
    return Document(**document_data)

def save_document(document: Document):
    """Save a document to data/docs/doc-{id}.json."""
    path = Path("data/documents") / f"doc-{document.id}.json"
    with open(path, "w") as f:
        json.dump(document.model_dump(), f, indent=4)