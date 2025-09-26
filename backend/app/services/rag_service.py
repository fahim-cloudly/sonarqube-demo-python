# backend/app/services/rag_service.py
import logging
from typing import List, Tuple
from app.utils.embeddings import embed_texts
from app.services.graph_service import semantic_search_by_embedding, get_side_effects
from app.services.llm_service import get_llm_service

logger = logging.getLogger("medical-chatbot.services.rag_service")


def truncate_context(context_lines: List[str], max_chars: int = 4000) -> List[str]:
    """
    Ensure the combined context does not exceed max_chars.
    Keep top items and trim the rest.
    """
    result = []
    total = 0
    for line in context_lines:
        if total + len(line) > max_chars:
            break
        result.append(line)
        total += len(line)
    return result


def answer_question(question: str, top_k: int = 5) -> Tuple[str, List[str]]:
    query_emb = embed_texts([question])[0]
    hits = semantic_search_by_embedding(query_emb, top_k=top_k)

    context_lines = []
    sources = []
    for hit in hits:
        name = hit["name"]
        score = hit["score"]
        desc = hit.get("description") or ""
        context_lines.append(f"Drug: {name} (score={score:.3f}) - {desc}")
        sfx = get_side_effects(name)
        if sfx:
            context_lines.append(f"Side effects of {name}: {', '.join(sfx[:10])}")  # limit long lists
        sources.append(f"Drug:{name}")
    
    logger.info("Context lines for question '%s': %s", question, context_lines)

    # ✅ truncate context before sending to LLM
    context_lines = truncate_context(context_lines, max_chars=4000)

    system_prompt = (
        "You are a medical knowledge assistant. Use the provided context facts and only those facts "
        "to generate a concise, referenced answer. If context is insufficient, say you are unsure and "
        "recommend consulting a healthcare professional."
    )
    user_prompt = f"QUESTION: {question}\n\nCONTEXT:\n" + "\n".join(context_lines)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    llm = get_llm_service()
    answer_text = llm.chat_completion(messages=messages, model="openai/gpt-oss-20b", temperature=0.0)

    return answer_text, sources
