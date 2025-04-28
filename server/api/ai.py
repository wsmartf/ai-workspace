import asyncio
import json
from typing import Optional
from openai import AsyncOpenAI
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage
from openai.types.responses import Response
from api.memory import load_memory
from models.chat_request import ChatRequest
from models.chat_message import ChatMessage
from dotenv import load_dotenv
from os import getenv

load_dotenv()

client = AsyncOpenAI(api_key=getenv("OPENAI_API_KEY"))
MODEL = "gpt-4.1-nano"


def system_role(memory: Optional[str] = None):
    memory_str = f"\nHere are some shared memory notes:\n{memory}" if memory else ""
    return {
        "role": "system",
        "content": (
            "You are a helpful assistant working on an AI-native thinking tool."
            + memory_str
        ),
    }


async def chat_completion(req: ChatRequest) -> str:
    memory = "\n".join(f"- {item.title}: {item.content}" for item in load_memory())
    messages_parsed = [
        {"role": message.role, "content": message.content} for message in req.messages
    ]

    chat_completion: ChatCompletion = await client.chat.completions.create(
        model=MODEL,
        messages=[
            system_role(memory),
            {
                "role": "user",
                "content": f"Document context:\n\n{req.document.strip()}\n\n",
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


async def edit_document(req: ChatRequest) -> dict:
    """
    Edit a document based on user instructions.

    Returns a dictionary with two fields:
    - 'document': the full, revised markdown document
    - 'message': a short explanation of what you changed
    """
    memory = "\n".join(f"- {item.title}: {item.content}" for item in load_memory())

    messages_parsed = [
        {"role": message.role, "content": message.content} for message in req.messages
    ]

    response: Response = await client.responses.create(
        model=MODEL,
        input=[
            system_role(memory),
            *messages_parsed,
            {
                "role": "user",
                "content": f"Here is the current document to edit:\n\n{req.document.strip()}\n\n",
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


if __name__ == "__main__":
    document = "Grocery List: \n- Apples\n- Bananas\n- Carrots"
    user_input = "Please add 'Oranges' to the grocery list. Also, add my name to the top of the document."
    req = ChatRequest(
        messages=[ChatMessage(role="user", content=user_input, created_at="1234")],
        document=document,
    )
    event = asyncio.run(chat_completion(req))
    print(event)
