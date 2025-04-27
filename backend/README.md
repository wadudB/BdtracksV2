# BdTracks Commodity API

Backend API for the Bangladesh Commodity Price Tracking System.

## Features

- Track commodity prices across different regions in Bangladesh
- View historical price data and trends
- Analyze regional price variations
- Track supply chain stages and data
- User authentication and role-based access

## Technology Stack

- FastAPI - High-performance web framework
- SQLAlchemy - SQL toolkit and ORM
- Alembic - Database migration tool
- MySQL - Relational database
- Poetry - Python dependency management

## Installation

1. Clone the repository

2. Install Poetry (if not already installed):

```bash
# On Linux, macOS, Windows (WSL)
curl -sSL https://install.python-poetry.org | python3 -

# On Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

3. Set up the project and install dependencies:

```bash
cd backend
poetry install
```

4. Configure your environment variables by creating a `.env` file:

```bash
# Create .env file from the example template
cp .env.example .env
# Edit the .env file with your specific database credentials
```

Your .env file should contain values like:

```
MYSQL_SERVER=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=bdtracks
```

5. Create MySQL database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE bdtracks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Activate the Poetry virtual environment and run database migrations:

```bash
poetry shell
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

7. Start the API server:

```bash
# Inside Poetry environment
uvicorn app.main:app --reload

# Or without activating the environment
poetry run uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── alembic/              # Database migrations
├── app/                  # Application code
│   ├── api/              # API endpoints
│   │   └── v1/           # API version 1
│   ├── core/             # Core functionality, config
│   ├── crud/             # Database CRUD operations
│   ├── db/               # Database session, base models
│   ├── models/           # SQLAlchemy models
│   └── schemas/          # Pydantic schemas
└── tests/                # Unit and integration tests
```

## Poetry Commands

```bash
# Add a new dependency
poetry add package-name

# Add a development dependency
poetry add --group dev package-name

# Update dependencies
poetry update

# Export requirements.txt (if needed)
poetry export -f requirements.txt --output requirements.txt --without-hashes
``` 