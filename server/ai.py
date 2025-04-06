import asyncio
import json
from openai import AsyncOpenAI
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage
from openai.types.responses import Response
from pydantic import BaseModel

client = AsyncOpenAI()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    document: str


class EditRequest(BaseModel):
    messages: list[Message]
    document: str


async def chat_completion(req: ChatRequest):
    # Prepend the document as context to the conversation
    document_context = (
        f"The following document is provided for context:\n{req.document}\n\n"
    )
    messages_with_context = [
        Message(role="system", content=document_context)
    ] + req.messages

    chat_completion: ChatCompletion = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages_with_context,
        temperature=1,
        max_completion_tokens=1000,
        top_p=1,
        store=True,
    )
    # Extract the response from the chat completion
    msg: ChatCompletionMessage = chat_completion.choices[0].message
    return msg.content


edit_schema = {
    "type": "object",
    "properties": {
        "updated_doc": {"type": "string"},
        "chat_response": {"type": "string"},
    },
    "required": ["updated_doc", "chat_response"],
    "additionalProperties": False,
}


async def edit_document(req: ChatRequest) -> dict:
    """
    Edit a document based on user instructions.

    Returns a dictionary with two fields:
    - 'updated_doc': the full, revised markdown document
    - 'edit_summary': a short explanation of what you changed
    """

    response: Response = await client.responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "You are a helpful AI that updates markdown documents based on edit instructions."
                ),
            },
            *req.messages,
            {
                "role": "user",
                "content": f"Here is the current document:\n\n{req.document.strip()}",
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
    user_input = "Please add 'Oranges' to the grocery list."
    req = ChatRequest(
        messages=[Message(role="user", content=user_input)], document=document
    )
    event = asyncio.run(edit_document(req))
    print(event)
