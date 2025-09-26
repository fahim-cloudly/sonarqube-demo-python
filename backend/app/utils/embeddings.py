# backend/app/utils/embeddings.py
import logging
from typing import List
from app.core.config import settings

logger = logging.getLogger("medical-chatbot.utils.embeddings")

# Lazy import (heavy model)
_model = None


def _init_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as e:
            raise RuntimeError("Install sentence-transformers to use local embeddings: pip install sentence-transformers") from e
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Return embeddings for a list of texts.
    """
    model = _init_model()
    logger.info("Computing embeddings for %d texts", len(texts))
    embs = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return [list(map(float, e)) for e in embs]
