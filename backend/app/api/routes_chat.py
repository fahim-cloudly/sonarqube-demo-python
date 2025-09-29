# backend/app/api/routes_chat.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
from app.services import rag_service

logger = logging.getLogger("medical-chatbot.api.routes_chat")
router = APIRouter()


class SourceItem(BaseModel):
    title: str
    url: str
    type: str  # journal | trial | guideline


class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 5


class QueryResponse(BaseModel):
    answer: str
    sources: Optional[List[SourceItem]] = []


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/ask", response_model=QueryResponse)
def ask(request: QueryRequest):
    try:
        answer, sources = rag_service.answer_question(request.question, top_k=request.top_k)
        # convert sources to structured objects for frontend
        structured_sources = [{"title": s, "url": "#", "type": "journal"} for s in sources]
        return QueryResponse(answer=answer, sources=structured_sources)
    except Exception as e:
        logger.exception("Failed to answer question")
        raise HTTPException(status_code=500, detail=str(e))
