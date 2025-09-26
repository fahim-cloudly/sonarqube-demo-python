# backend/app/utils/preprocess.py
import pandas as pd
import logging
from typing import Optional

logger = logging.getLogger("medical-chatbot.utils.preprocess")


def load_drug_dataframe(path: str) -> Optional[pd.DataFrame]:
    """
    Load Kaggle drug dataset (CSV/TSV).
    Returns a pandas DataFrame with normalized columns:
    - drugName, condition, review, sideEffects (if present)
    """
    logger.info("Loading drug dataset from %s", path)
    if path.endswith(".tsv") or path.endswith(".txt"):
        df = pd.read_csv(path, sep="\t", dtype=str, on_bad_lines="skip")
    else:
        df = pd.read_csv(path, dtype=str, on_bad_lines="skip")

    # normalize column names
    df.columns = [c.strip() for c in df.columns]
    # common Kaggle dataset columns: drugName, condition, review, rating, usefulCount
    # if there is no sideEffects column, attempt to parse from review text (not implemented)
    expected = ["drugName", "condition", "review"]
    for col in expected:
        if col not in df.columns:
            df[col] = ""

    # ensure safe types
    df = df.fillna("")
    # create a sideEffects column if present names vary
    possible_effects_cols = [c for c in df.columns if "side" in c.lower()]
    if possible_effects_cols:
        df["sideEffects"] = df[possible_effects_cols[0]]
    else:
        df["sideEffects"] = ""

    logger.info("Loaded %d rows", len(df))
    return df
