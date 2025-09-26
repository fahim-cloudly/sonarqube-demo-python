# backend/app/api/routes_admin.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import logging
import shutil
import os

from app.services import graph_service

logger = logging.getLogger("medical-chatbot.api.routes_admin")
router = APIRouter()


class IngestResponse(BaseModel):
    success: bool
    message: str


@router.post("/ingest")
def ingest_csv(file_path: Optional[str] = Form(None)):
    """
    Ingest CSV/TSV file into Neo4j.
    Option 1: supply `file_path` on the server filesystem (fast).
    Option 2: Use file upload endpoint below to upload and ingest.
    """
    if not file_path:
        raise HTTPException(status_code=400, detail="file_path form field required")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="file not found on server")
    try:
        count = graph_service.ingest_drug_file(file_path)
        return IngestResponse(success=True, message=f"Ingested {count} rows.")
    except Exception as e:
        logger.exception("Ingestion failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload_and_ingest")
async def upload_and_ingest(file: UploadFile = File(...)):
    """
    Upload the dataset file and ingest it.
    Returns number of records ingested.
    """
    upload_dir = "/tmp/medical_chatbot_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    dest_path = os.path.join(upload_dir, file.filename)
    with open(dest_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        count = graph_service.ingest_drug_file(dest_path)
        return IngestResponse(success=True, message=f"Ingested {count} rows.")
    except Exception as e:
        logger.exception("Upload+Ingest failed")
        raise HTTPException(status_code=500, detail=str(e))
