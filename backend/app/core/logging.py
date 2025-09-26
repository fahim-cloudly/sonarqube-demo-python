# backend/app/core/logging.py
import logging
import sys


def configure_logging():
    root = logging.getLogger()
    root.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    if not root.handlers:
        root.addHandler(handler)
    else:
        root.handlers[0] = handler
