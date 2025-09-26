# backend/app/tests/test_rag.py
import pytest
from app.utils.embeddings import embed_texts


def test_embeddings_length():
    texts = ["aspirin reduces fever", "amoxicillin may cause diarrhea"]
    embs = embed_texts(texts)
    assert len(embs) == 2
    assert isinstance(embs[0][0], float)
