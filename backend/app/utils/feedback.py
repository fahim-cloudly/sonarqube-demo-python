# backend/app/utils/feedback.py
import logging
from app.db.database import get_conn

logger = logging.getLogger("medical-chatbot.utils.feedback")


def record_feedback(question: str, answer: str, rating: int = None, comment: str = None):
    conn = get_conn()
    with conn:
        conn.execute(
            "INSERT INTO feedback (question, answer, rating, comment) VALUES (?, ?, ?, ?)",
            (question, answer, rating, comment),
        )
    logger.info("Recorded feedback for question: %s", question)
