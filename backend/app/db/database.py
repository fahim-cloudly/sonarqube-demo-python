# backend/app/db/database.py
import sqlite3
from app.core.config import settings
import threading

_lock = threading.Lock()
_conn = None


def get_conn():
    global _conn
    if _conn is None:
        _conn = sqlite3.connect(settings.SQLITE_PATH, check_same_thread=False)
        _initialize(_conn)
    return _conn


def _initialize(conn):
    with conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT,
                answer TEXT,
                rating INTEGER,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
