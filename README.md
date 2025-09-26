# Medical Chatbot

A medical chatbot application using LLM + RAG (Retrieval Augmented Generation) with Neo4j graph database for medical knowledge retrieval and consultation.

## Architecture

- **Backend**: FastAPI server with Neo4j graph database integration
- **Frontend**: Streamlit web application with custom medical chatbot UI
- **LLM Integration**: Groq API for language model capabilities
- **Embeddings**: Sentence transformers for vector similarity search
- **Package Management**: UV for fast Python package management

## Project Structure

```
medical-chatbot/
    backend/                # FastAPI backend application
        app/
            api/                # API routes
            core/               # Configuration and logging
            data/               # Medical data files
            db/                 # Database connections
            main.py             # FastAPI application entry point
            models/             # Pydantic models
            services/           # Business logic
            tests/              # Backend tests
            utils/              # Utility functions
        Dockerfile
        pyproject.toml
        uv.lock
    frontend/               # Streamlit frontend application
        components/           # UI components
        utils/                # Frontend utilities
        app.py                # Main Streamlit app
        pyproject.toml
        uv.lock
    scripts/                # Data processing scripts
        build_graph.py        # Neo4j graph construction
        ingest_data.py        # Data ingestion pipeline
        train_embeddings.py   # Embedding training
    data/                   # Data directory
    docker-compose.yml      # Docker orchestration
    .env                    # Environment variables
```

## Prerequisites

- Python 3.9+
- Neo4j database
- UV package manager
- Docker (optional)

## Installation

1. Clone the repository:
        ```bash
        git clone <repository-url>
        cd medical-chatbot
        ```

2. Install dependencies using UV:
        ```bash
        # Backend
        cd backend
        uv sync

        # Frontend
        cd ../frontend
        uv sync
        ```

## Configuration

Set up your environment variables in `.env`:
```env
# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# Backend Configuration
BACKEND_URL=http://localhost:8000
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- API: [http://localhost:8000](http://localhost:8000)
- Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Populate the Database

Upload and ingest medical data:
```bash
curl -v -X POST \
    -F "file=@/home/fahim-bro/medical-chatbot/backend/app/data/Medicine_Details.csv" \
    http://localhost:8000/api/admin/upload_and_ingest
```

### 3. Start the Frontend

```bash
cd frontend
uv run streamlit run app.py
```

The frontend will be available at: [http://localhost:8501](http://localhost:8501)

## Features

- Interactive medical chatbot interface built with Streamlit
- RAG-based medical knowledge retrieval
- Neo4j graph database for medical relationships
- Vector similarity search using sentence transformers
- FastAPI backend with automatic API documentation
- Custom medical-themed UI
- Fast dependency management with UV
- CSV data upload and ingestion via API

## API Endpoints

- `POST /chat` - Send messages to the medical chatbot
- `POST /api/admin/upload_and_ingest` - Upload and ingest medical data
- `GET /health` - Health check endpoint
- Additional endpoints available at `/docs`

## Development

### Backend Development

```bash
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
uv run streamlit run app.py
```

### Testing

```bash
cd backend
uv run pytest
```

## Data Format

The system expects CSV files with medical data. Place your data files in `backend/app/data/` and use the upload endpoint to ingest them into the Neo4j database.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

[Add your license information here]

## Disclaimer

**Important**: This chatbot is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers for medical concerns.