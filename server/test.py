import requests
import json

BASE_URL = "http://127.0.0.1:11434"

def send_message(thread_id: int, content: str):
    url = f"{BASE_URL}/threads/{thread_id}/messages"
    payload = {
        "content": content
    }
    res = requests.post(url, json=payload)
    print(f"Status: {res.status_code}")
    try:
        data = res.json()
        print(json.dumps(data, indent=2))
    except Exception as e:
        print("Failed to parse JSON:", e)

if __name__ == "__main__":
    send_message(1, "What does the document say?")
