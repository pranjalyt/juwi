import os
from dotenv import load_dotenv
load_dotenv()
import requests

message = input("Enter ur message: \n")

response = requests.post(
    os.environ.get("LLM_BASE_URL", "http://localhost:1234/v1").rstrip("/") + "/chat/completions",
    json={
        "model": "qwen3.5-2b",
        # "messages": [{"role": "user", "content": "Say hello in one sentence."}]
        "messages": [{"role": "user", "content": message}]
    }
)

print(response.json()["choices"][0]["message"]["content"])