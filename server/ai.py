import asyncio
from openai import AsyncOpenAI
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage
from pydantic import BaseModel
client = AsyncOpenAI()


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    document: str


async def chat_completion(req: ChatRequest):
    # Prepend the document as context to the conversation
    document_context = f"The following document is provided for context:\n{req.document}\n\n"
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


if __name__ == "__main__":
    user_input = "What is my name?"
    document = "This is a document about the user. His name is Will Smart."
    req = ChatRequest(
        messages=[Message(role="user", content=user_input)],
        document=document
    )
    response = asyncio.run(chat_completion(req))
    print("Response:", response)