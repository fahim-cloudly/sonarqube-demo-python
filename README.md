# Medical Chatbot

A medical chatbot application using LLM + RAG (Retrieval Augmented Generation) with Neo4j graph database for medical knowledge retrieval and consultation.

## Architecture

- **Backend**: FastAPI server with Neo4j graph database integration
- **Frontend**: React application built with Vite and modern UI components
- **LLM Integration**: Groq API for language model capabilities
- **Embeddings**: Sentence transformers for vector similarity search
- **Package Management**: UV for Python dependencies, npm for frontend
- **Code Quality**: SonarQube integration for code analysis

## Project Structure

```
sonarqube-demo-python/
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
        pyproject.toml          # Python dependencies
        build_graph.py          # Neo4j graph construction
        ingest_data.py          # Data ingestion pipeline
        train_embeddings.py     # Embedding training
    scripts/                # Data processing scripts
    data/                   # Data directory
        embeddings/             # Vector embeddings
        graphs/                 # Graph data
        processed/              # Processed datasets
        raw/                    # Raw data files
    .github/                # GitHub workflows
        workflows/              # CI/CD pipelines
    frontend/               # React frontend application
        src/
            components/         # React UI components
            guidelines/         # Development guidelines
            lib/                # Utility libraries
            styles/             # CSS and styling
        package.json            # Node.js dependencies
    docker-compose.yml      # Docker orchestration (empty)
    .env                    # Environment variables (empty)
    sonar-project.properties # SonarQube configuration
    .gitignore              # Git ignore rules
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- Neo4j database
- UV package manager for Python
- npm for frontend dependencies
- Docker (optional)

## Installation

1. Clone the repository:
        ```bash
        git clone <repository-url>
        cd sonarqube-demo-python
        ```

2. Install backend dependencies using UV:
        ```bash
        cd backend
        uv sync
        ```

3. Install frontend dependencies using npm:
        ```bash
        cd ../frontend
        npm install
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
    -F "file=@/path/to/your/medical/data.csv" \
    http://localhost:8000/api/admin/upload_and_ingest
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at: [http://localhost:5173](http://localhost:5173) (Vite default port)

## Features

- Interactive medical chatbot interface built with React and modern UI components
- RAG-based medical knowledge retrieval
- Neo4j graph database for medical relationships
- Vector similarity search using sentence transformers
- FastAPI backend with automatic API documentation
- Modern responsive UI with Radix UI components
- Fast dependency management with UV for Python and npm for frontend
- CSV data upload and ingestion via API
- SonarQube integration for code quality analysis

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
npm run dev
```

### Testing

```bash
cd backend
uv run pytest
```

### Code Quality Analysis

Run SonarQube analysis (requires SonarQube server or SonarCloud setup):
```bash
sonar-scanner
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