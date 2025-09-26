# backend/app/services/llm_service.py
import os
import logging
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger("medical-chatbot.services.llm_service")

try:
    # Official Groq Python package (docs: console.groq.com/docs/quickstart)
    from groq import Groq
    _GROQ_AVAILABLE = True
except Exception:
    _GROQ_AVAILABLE = False
    logger.warning("groq package not available. Ensure `pip install groq` or your uv env has it.")


class LLMService:
    def __init__(self, api_key: Optional[str] = None):
        api_key = api_key or settings.GROQ_API_KEY
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set in environment/config.")
        if not _GROQ_AVAILABLE:
            raise RuntimeError("groq python package not installed.")
        self.client = Groq(api_key=api_key)

    def chat_completion(self, messages: List[dict], model: str = "openai/gpt-oss-20b", temperature: float = 0.0) -> str:
        """
        messages: list of {"role": "system|user|assistant", "content": "..."}
        """
        logger.info("Requesting chat completion from Groq")
        resp = self.client.chat.completions.create(
            messages=messages,
            model=model,
            temperature=temperature,
        )
        # Groq response format: resp.choices[0].message.content
        try:
            return resp.choices[0].message.content
        except Exception:
            # Fallback: str(resp)
            logger.exception("Unexpected Groq response structure")
            return str(resp)


# helper singleton
_llm_service = None


def get_llm_service():
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
