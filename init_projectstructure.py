import os

# Define project structure
structure = {
    "medical-chatbot": {
        "backend": {
            "app": {
                "api": {
                    "routes_chat.py": "",
                    "routes_admin.py": ""
                },
                "core": {
                    "config.py": "",
                    "logging.py": ""
                },
                "services": {
                    "rag_service.py": "",
                    "graph_service.py": "",
                    "llm_service.py": ""
                },
                "models": {
                    "drug_schema.py": ""
                },
                "db": {
                    "database.py": "",
                    "neo4j_driver.py": ""
                },
                "utils": {
                    "preprocess.py": "",
                    "embeddings.py": "",
                    "feedback.py": ""
                },
                "tests": {
                    "test_api.py": "",
                    "test_rag.py": ""
                },
                "main.py": ""
            },
            "pyproject.toml": "",
            "Dockerfile": "",
            "uvicorn_server.sh": ""
        },
        "frontend": {
            "app.py": "",
            "components": {
                "chat_box.py": "",
                "sidebar.py": ""
            },
            "utils": {
                "api_client.py": ""
            }
            "pyproject.toml": "",
        },
        "data": {
            "raw": {},
            "processed": {},
            "embeddings": {},
            "graphs": {}
        },
        "scripts": {
            "ingest_data.py": "",
            "build_graph.py": "",
            "train_embeddings.py": ""
        },
        
        ".env": "",
        "docker-compose.yml": "",
        "README.md": ""
    }
}


def create_structure(base_path, structure):
    """Recursively create directories and files based on a nested dictionary."""
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w") as f:
                f.write(content)


if __name__ == "__main__":
    base_dir = os.getcwd()  # current working directory
    create_structure(base_dir, structure)
    print("✅ Project structure created successfully!")

