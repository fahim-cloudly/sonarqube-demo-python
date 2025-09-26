# backend/app/services/graph_service.py
import logging
import csv
import os
from typing import List, Dict, Any
import numpy as np
from app.db.neo4j_driver import get_driver
from app.utils.preprocess import load_drug_dataframe
from app.utils.embeddings import embed_texts
from app.core.config import settings

logger = logging.getLogger("medical-chatbot.services.graph_service")


def _create_constraints(session):
    """
    Create uniqueness constraints for nodes we use (Neo4j 5+ syntax).
    Uses FOR / REQUIRE instead of ON / ASSERT.
    """
    try:
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (d:Drug) REQUIRE (d.name) IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (s:SideEffect) REQUIRE (s.name) IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (c:Condition) REQUIRE (c.name) IS UNIQUE")
    except Exception as e:
        # log and re-raise if needed; keep behavior tolerant (sometimes constraints already exist)
        import logging
        logging.getLogger("medical-chatbot.services.graph_service").warning(
            "Error creating constraints (may be fine if already set): %s", e
        )



def ingest_drug_file(path: str) -> int:
    """
    Read dataset at `path` and create nodes/edges in Neo4j.
    Expected columns from CSV: Medicine Name, Uses, Side_effects, Excellent Review %, Average Review %, Poor Review %
    This function:
    - loads dataframe
    - generates a small textual description per row
    - computes embeddings
    - creates (Drug) nodes, (Condition) nodes, (SideEffect) nodes, and relationships
    """
    df = load_drug_dataframe(path)
    if df is None or df.shape[0] == 0:
        raise RuntimeError("No rows found in data file.")

    texts = []
    meta_rows = []

    for _, row in df.iterrows():
        drug = str(row.get("Medicine Name", "")).strip()
        cond = str(row.get("Uses", "")).strip()
        effects = str(row.get("Side_effects", "")).strip()
        # For description, we can include reviews as well
        review = str(row.get("Excellent Review %", "")) + "%" if "Excellent Review %" in row else ""
        desc = " | ".join(filter(None, [drug, cond, review, effects]))

        texts.append(desc)
        meta_rows.append({
            "drug": drug,
            "condition": cond,
            "effects": effects,
            "review": review
        })

    embeddings = embed_texts(texts)

    driver = get_driver()
    with driver.session() as session:
        _create_constraints(session)
        tx = session.begin_transaction()
        count = 0

        for meta, emb in zip(meta_rows, embeddings):
            drug = meta["drug"]
            cond = meta["condition"] or None
            effects = meta["effects"] or None

            # Create drug node
            tx.run(
                """
                MERGE (d:Drug {name: $name})
                SET d.description = coalesce(d.description, $desc),
                    d.embedding = $embedding
                """,
                name=drug,
                desc=meta["review"][:1000],
                embedding=list(map(float, emb)),
            )

            # Create condition node and relationship
            if cond:
                tx.run(
                    """
                    MERGE (c:Condition {name: $cname})
                    MERGE (d:Drug {name: $dname})
                    MERGE (d)-[:TREATS]->(c)
                    """,
                    cname=cond,
                    dname=drug,
                )

            # Create side effect nodes and relationships
            if effects:
                for e in [x.strip() for x in effects.split(",") if x.strip()]:
                    tx.run(
                        """
                        MERGE (s:SideEffect {name: $sname})
                        MERGE (d:Drug {name: $dname})
                        MERGE (d)-[:HAS_SIDE_EFFECT]->(s)
                        """,
                        sname=e,
                        dname=drug,
                    )

            count += 1

        tx.commit()

    logger.info(f"Ingested {count} rows into Neo4j.")
    return count

def get_side_effects(drug_name: str) -> List[str]:
    driver = get_driver()
    with driver.session() as session:
        res = session.run(
            """
            MATCH (d:Drug {name: $name})-[:HAS_SIDE_EFFECT]->(s:SideEffect)
            RETURN s.name as name
            """,
            name=drug_name,
        )
        return [r["name"] for r in res]


def _cosine(a: List[float], b: List[float]) -> float:
    a = np.array(a)
    b = np.array(b)
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def semantic_search_by_embedding(query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Naive vector search on embeddings stored in Neo4j nodes.
    This pulls back candidate nodes' embeddings and computes cosine similarity in Python.
    For large datasets replace with a vector DB or use Neo4j vector index features.
    """
    driver = get_driver()
    with driver.session() as session:
        res = session.run("MATCH (d:Drug) RETURN d.name as name, d.embedding as embedding, d.description as description")
        rows = []
        for r in res:
            emb = r["embedding"]
            if emb is None:
                continue
            score = _cosine(query_embedding, emb)
            rows.append({"name": r["name"], "score": score, "description": r.get("description")})
        rows = sorted(rows, key=lambda x: x["score"], reverse=True)
        return rows[:top_k]
