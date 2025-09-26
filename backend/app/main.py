# backend/app/main.py
import atexit
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_chat, routes_admin
from app.core import config, logging as logging_config
from app.db.neo4j_driver import init_neo4j, close_neo4j

logging_config.configure_logging()
logger = logging.getLogger("medical-chatbot")

app = FastAPI(title="Medical Chatbot API", version="0.1.0")

# CORS for local dev - adjust origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes_chat.router, prefix="/api")
app.include_router(routes_admin.router, prefix="/api/admin")


@app.on_event("startup")
async def startup_event():
    logger.info("Starting application...")
    init_neo4j()
    logger.info("Neo4j driver initialized.")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down application...")
    close_neo4j()
    logger.info("Neo4j driver closed.")


# ensure driver closes if process killed outside FastAPI lifecycle
atexit.register(lambda: close_neo4j())
