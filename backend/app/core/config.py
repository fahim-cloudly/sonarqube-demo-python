# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "neo4j"

    # Groq / LLM
    GROQ_API_KEY: str = ""

    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Local metadata DB
    SQLITE_PATH: str = "metadata.db"

    # Ingestion & tuning
    INGEST_BATCH_SIZE: int = 500

    # Use pydantic-settings model_config to load .env
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

# single settings instance to import across the app
settings = Settings()
