# backend/app/db/neo4j_driver.py
import logging
from neo4j import GraphDatabase, Driver
from app.core.config import settings

logger = logging.getLogger("medical-chatbot.db.neo4j_driver")
_driver: Driver = None


def init_neo4j():
    global _driver
    if _driver is None:
        logger.info("Initializing Neo4j driver...")
        _driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )


def get_driver() -> Driver:
    if _driver is None:
        init_neo4j()
    return _driver


def close_neo4j():
    global _driver
    if _driver:
        try:
            _driver.close()
        except Exception:
            logger.exception("Error closing Neo4j driver")
        _driver = None
