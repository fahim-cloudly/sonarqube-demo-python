# backend/app/models/drug_schema.py
from pydantic import BaseModel
from typing import List, Optional


class Drug(BaseModel):
    name: str
    description: Optional[str] = None
    conditions: Optional[List[str]] = []
    side_effects: Optional[List[str]] = []
    embedding: Optional[List[float]] = None
