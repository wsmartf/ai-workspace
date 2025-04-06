from openai import OpenAI
from pydantic import BaseModel
client = OpenAI()


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]


def prompt(req: ChatRequest):
    response = client.responses.create(
        model="gpt-4o-mini",
        input=req.messages,
        temperature=1,
        max_output_tokens=1000,
        top_p=1,
        store=True,
    )
    return response.output_text


if __name__ == "__main__":
    user_input = "What is the capital of France?"
    response = prompt(user_input)
    print("Response:", response)