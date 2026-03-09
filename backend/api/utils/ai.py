import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def rewrite_message_tone(message, tone):
    prompt = f"""
    Rewrite the following message in a {tone} tone.
    - Keep the meaning the same.
    - Keep it short (2–3 sentences).
    - Do NOT add new advice.
    - Do NOT mention mental health or therapy.
    - Keep it performance-focused and supportive.

    Message:
    "{message}"
    """

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    data = response.json()
    return data["choices"][0]["message"]["content"].strip()