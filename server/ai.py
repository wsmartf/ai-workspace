import asyncio
import json
from typing import Optional
from openai import AsyncOpenAI
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage
from openai.types.responses import Response
from memory import load_memory
from structs import ChatRequest, Message
from dotenv import load_dotenv
from os import getenv
load_dotenv()

client = AsyncOpenAI(api_key=getenv("OPENAI_API_KEY"))

def system_role(memory: Optional[str] = None):
    memory_str = f"\nHere are some shared memory notes:\n{memory}" if memory else ""
    return {
        "role": "system",
        "content": (
            "You are a helpful assistant working on an AI-native thinking tool."
            + memory_str
        )
    }


async def chat_completion(req: ChatRequest):
    # Prepend the document as context to the conversation
    memory = "\n".join(
        f"- {item.title}: {item.content}" for item in load_memory()
    )

    chat_completion: ChatCompletion = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            system_role(memory),
            {
                "role": "user",
                "content": f"Document context:\n\n{req.document.strip()}\n\n"
            },
            *req.messages,
            
        ],
        temperature=0.7,
        max_completion_tokens=1000,
        top_p=1,
        store=True,
    )
    # Extract the response from the chat completion
    msg: ChatCompletionMessage = chat_completion.choices[0].message
    return msg.content


async def edit_document(req: ChatRequest) -> dict:
    """
    Edit a document based on user instructions.

    Returns a dictionary with two fields:
    - 'updated_doc': the full, revised markdown document
    - 'edit_summary': a short explanation of what you changed
    """
    memory = "\n".join(
        f"- {item.title}: {item.content}" for item in load_memory()
    )

    response: Response = await client.responses.create(
        model="gpt-4o-mini",
        input=[
            system_role(memory),
            *req.messages,
            {
                "role": "user",
                "content": f"Here is the current document to edit:\n\n{req.document.strip()}\n\n"
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
                        "edit_summary": {"type": "string"},
                        "updated_doc": {"type": "string"},
                    },
                    "required": ["updated_doc", "edit_summary"],
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
        messages=[Message(role="user", content=user_input)], document=document
    )
    event = asyncio.run(edit_document(req))
    print(event)
