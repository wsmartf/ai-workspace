import asyncio
import json
from typing import Optional
from openai import AsyncOpenAI
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage
from openai.types.responses import Response
from models.chat_request import ChatRequest
from models.chat_message import ChatMessage
from dotenv import load_dotenv
from os import getenv
import logging

from models.node import Node

log = logging.getLogger(__name__)

load_dotenv()
OPENAI_API_KEY = getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OpenAI API key. Set OPENAI_API_KEY in .env or as an environment variable.")

client = AsyncOpenAI(api_key=OPENAI_API_KEY)
MODEL = "gpt-4.1-nano"


def system_role():
    content = """\
You are an assistant helping the user think, explore ideas, and write documents.
You are part of a shared workspace where the user works on evolving ideas, projects, and documents over time.
Use the provided document and knowledge nodes as persistent context — they reflect the user's current understanding and goals.
Your job is not just to answer questions, but to help clarify thinking, propose alternatives, and assist in writing or structuring useful output.
Be concise but thoughtful. Avoid repeating context unless asked. Ask clarifying questions if needed.
"""
    return {
        "role": "system",
        "content": content,
    }


def parse_nodes(nodes: list[Node]) -> str:
    nodes_content = (
        "\n".join(f"- {node.title}: {node.content}" for node in nodes) if nodes else ""
    )
    nodes_str = (
        f"\nHere are some related knowledge nodes:\n{nodes_content}" if nodes else ""
    )
    return {
        "role": "system",
        "content": f"Related knowledge nodes:\n{nodes_str}",
    }


async def chat_completion(
    messages: list[ChatMessage], document: str, nodes: list[Node]
) -> str:
    messages_parsed = [
        {"role": message.role, "content": message.content} for message in messages
    ]

    log.info(
        f"Querying OpenAI for chat completion"
    )
    chat_completion: ChatCompletion = await client.chat.completions.create(
        model=MODEL,
        messages=[
            system_role(),
            parse_nodes(nodes),
            {
                "role": "system",
                "content": f"Current document:\n{document.strip()}\n",
            },
            *messages_parsed,
        ],
        temperature=0.7,
        max_completion_tokens=1000,
        top_p=1,
        store=True,
    )
    msg: ChatCompletionMessage = chat_completion.choices[0].message
    return msg.content


async def edit_document(
    messages: list[ChatMessage], document: str, nodes: list[Node]
) -> dict:
    """
    Edit a document based on user instructions.

    Returns a dictionary with two fields:
    - 'document': the full, revised markdown document
    - 'message': a short explanation of what you changed
    """
    messages_parsed = [
        {"role": message.role, "content": message.content} for message in messages
    ]

    log.info(
        f"Querying OpenAI for document edit. \nDocument: {document}\nMessages: {messages_parsed}"
    )
    response: Response = await client.responses.create(
        model=MODEL,
        input=[
            system_role(),
            parse_nodes(nodes),
            *messages_parsed,
            {
                "role": "user",
                "content": f"Here is the current document to edit:\n\n{document.strip()}\n\n",
            },
        ],
        temperature=0.7,
        text={
            "format": {
                "type": "json_schema",
                "name": "edit_document",
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {"type": "string"},
                        "document": {"type": "string"},
                    },
                    "required": ["document", "message"],
                    "additionalProperties": False,
                },
                "strict": True,
            }
        },
    )

    return json.loads(response.output_text)


async def gen_node_content(
    messages: list[ChatMessage], document: str, old_node_context: Optional[str] = None
) -> dict:
    """Generate 'title' and 'content' for a node based on:
    - current document context
    - recent messages
    - previous node content (optional)

    Returns:
    {
        "title": "Short node title",
        "content": "Summarized content of this node"
    }
    """
    messages_parsed = [{"role": msg.role, "content": msg.content} for msg in messages]

    log.info("Querying OpenAI to generate node content.")

    context_blocks = [
        system_role(),
        {"role": "system", "content": f"Current document:\n\n{document.strip()}"},
        *messages_parsed,
    ]

    if old_node_context:
        context_blocks.insert(
            2,
            {
                "role": "system",
                "content": f"Previous node summary:\n\n{old_node_context.strip()}",
            },
        )

    prompt = """\
    Please create a reusable knowledge node based on the conversation and document above. The node should summarize the most important idea or decision.

    - The title should be a short, specific label (like “Dynamic Thread Context Strategy” or “Node Summarization Logic”).
    - The content should be a concise but informative explanation, 3–8 sentences long, that clearly explains the core idea, decision, or proposal.
    - Write it so someone reading only this node would understand the point — even without the full thread.
    - Avoid vague phrases like “we discussed” or “this thread is about...”. Just explain the idea directly.

    Return a JSON object with fields `title` and `content`.
    """

    context_blocks.append({"role": "user", "content": prompt})

    response = await client.responses.create(
        model=MODEL,
        input=context_blocks,
        temperature=0.7,
        text={
            "format": {
                "type": "json_schema",
                "name": "create_node",
                "schema": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "content": {"type": "string"},
                    },
                    "required": ["title", "content"],
                    "additionalProperties": False,
                },
                "strict": True,
            }
        },
    )

    return json.loads(response.output_text)


if __name__ == "__main__":
    messages = [
        {
            "content": "Summarize this idea in 2 sentences",
            "role": "user",
            "created_at": "2023-10-01T00:00:00Z",
        },
        {
            "content": "This concept is an AI-powered, chat-centric workspace that enables dynamic idea exploration, document collaboration, and knowledge organization through threaded conversations and an evolving memory system. It automatically extracts, links, and visualizes key insights and ideas, supporting seamless context retrieval and creative problem-solving across interconnected projects.",
            "role": "assistant",
            "created_at": "2023-10-01T00:00:00Z",
        },
    ]
    # Load messages into ChatMessage objects
    messages = [ChatMessage(**msg) for msg in messages]

    document = "### AI Workspace Concept: Interactive Chat-Based Idea and Document Assistant\n\n#### Core Concept\nAn AI-powered workspace where the user interacts primarily via chat. The AI acts as both an assistant and a collaborator, helping edit documents, brainstorm, and organize ideas in a dynamic, evolving knowledge system. The workspace supports branching idea threads and automatically builds and maintains a structured \u201cmemory\u201d of relevant information that grows and evolves with the user's input and interactions.\n\n---\n\n### Key Features\n\n#### 1. Chat-First Interaction\n- Users communicate with the AI agent naturally via chat.\n- The AI understands context, user intent, and can ask clarifying questions.\n- Supports multi-modal input: text, voice, file uploads (documents, images).\n\n#### 2. Idea Branching and Threading\n- Users can create multiple threads within a single workspace.\n- Each thread represents a different idea, project, or subtopic.\n- Threads can be forked or branched from existing ones to explore alternative directions.\n- Cross-thread linking and referencing allow users to connect related ideas.\n\n#### 3. Evolving Memory System\n- The AI automatically extracts and stores \u201cmemory notes\u201d \u2014 concise, structured knowledge snippets summarizing key points from conversations, documents, and edits.\n- Memory notes are tagged, categorized, and linked to relevant threads.\n- Users can view, edit, merge, or split memory notes to maintain accuracy and relevance.\n- Over time, this builds a personalized, evolving knowledge graph tailored to the user\u2019s projects and interests.\n\n#### 4. Contextual Retrieval Across Threads\n- The AI dynamically retrieves and surfaces relevant memory notes and previous interactions as context during conversations, regardless of the thread.\n- Supports semantic search and relevance ranking to prioritize the most useful information.\n- Enables the AI to maintain continuity even when switching topics or revisiting ideas after time gaps.\n\n#### 5. Collaborative Document Editing\n- Users can upload, create, and collaboratively edit documents within the workspace.\n- The AI assists by suggesting edits, summarizing content, generating new text, or reorganizing sections.\n- Changes and comments are tracked in the chat, linking document edits to discussion threads and memory notes.\n- Version control integrated with AI suggestions history.\n\n#### 6. Idea Visualization and Navigation\n- Visual maps or graphs represent threads and their interconnections.\n- Memory notes and documents are nodes in this graph, allowing intuitive exploration.\n- Users can quickly jump between threads, related notes, and documents.\n\n#### 7. Intelligent Problem Solving and Ideation\n- The AI can help break down complex problems into manageable parts.\n- Suggests creative solutions, alternative approaches, and relevant knowledge snippets.\n- Supports brainstorming sessions with interactive prompts and idea generation.\n\n---\n\n### User Journey Example\n\n1. **Start a new workspace** for a project idea.\n2. **Chat with the AI** to flesh out initial concepts; AI extracts key points into memory notes.\n3. **Branch off a thread** to explore a related subtopic or alternative approach.\n4. **Upload a draft document**; AI helps edit and summarize it.\n5. As you discuss, the AI **retrieves relevant memory notes** from past sessions and threads to inform the conversation.\n6. **Visualize the knowledge graph** to see how ideas connect.\n7. **Review and refine memory notes** to ensure accuracy.\n8. Use the workspace to **generate new documents, solve problems, or prepare presentations**, all with AI support.\n\n---\n\n### Technical Considerations\n\n- **Natural Language Understanding**: Robust NLP to parse user intent and context.\n- **Memory Architecture**: A knowledge graph or vector database to store and link memory notes.\n- **Context Management**: Efficient retrieval algorithms balancing recency, relevance, and importance.\n- **User Interface**: Intuitive chat UI augmented by visual graph navigation.\n- **Privacy and Control**: User ownership of data with transparent editing and deletion controls.\n- **Extensibility**: API access for integration with other tools (e.g., calendars, email, cloud storage).\n\n---\n\n### Potential Challenges\n\n- Managing context window limits in AI models while allowing cross-thread memory retrieval.\n- Balancing automation with user control over memory content and organization.\n- Ensuring smooth, natural conversational flow with complex multi-threaded contexts.\n- Designing an interface that remains clear despite potentially large knowledge graphs.\n\n---\n\nWould you like me to help you develop a prototype workflow, user interface sketches, or prioritize features for an MVP?"
    result = asyncio.run(gen_node_content(messages, document))
    print(f"Generated node content: {result}")
    print(f"Title: {result['title']}")
    print(f"Content: {result['content']}")
