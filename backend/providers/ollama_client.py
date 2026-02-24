# backend/providers/ollama_client.py
import os
import json
import httpx


def _normalize_host(host: str) -> str:
    host = (host or "").strip()
    if not host:
        return "http://127.0.0.1:11434"
    if host.startswith("http://") or host.startswith("https://"):
        return host
    return "http://" + host


async def generate(prompt: str, temperature: float = 0.2) -> str:
    """Ollama /api/generate 호출 (stream=False)."""
    host = _normalize_host(os.getenv("OLLAMA_HOST", "127.0.0.1:11434"))
    model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

    url = host.rstrip("/") + "/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": temperature},
    }

    timeout = float(os.getenv("REQUEST_TIMEOUT", "60"))
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()

    if isinstance(data, dict) and "response" in data:
        return data["response"] or ""

    # 방어: 예상치 못한 응답은 JSON으로 문자열화
    return json.dumps(data, ensure_ascii=False)
