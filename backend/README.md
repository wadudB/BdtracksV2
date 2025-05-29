# BDTracks Backend API

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- MySQL 8.0 or higher
- Poetry (Python dependency manager)

### Installation

1. **Install Poetry** (if not already installed):
```bash
# On Linux, macOS, Windows (WSL)
curl -sSL https://install.python-poetry.org | python3 -

# On Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# With pip
Pip install poetry
```

2. **Set up the project**:
```bash
cd backend
poetry install
```

3. **Environment Configuration**:
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

Required environment variables:
```env
# Database Configuration
MYSQL_SERVER=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=bdtracks

# Application Settings
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings (development)
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

4. **Database Setup**:
```bash
# Create MySQL database
mysql -u root -p
```
```sql
CREATE DATABASE bdtracks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

5. **Run Database Migrations**:
```bash
# Activate Poetry environment
poetry shell

# Run migrations
alembic upgrade head

# Optional: Create a new migration (if you made model changes)
alembic revision --autogenerate -m "Description of changes"
```

6. **Start the Development Server**:
```bash
# Inside Poetry environment
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or without activating the environment
poetry run uvicorn app.main:app --reload
```

## 📡 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

### Health Check Endpoints
- **Root**: `GET /` - Welcome message
- **Health**: `GET /healthcheck` - Application health status


## 🔧 Development Commands

### Poetry Commands
```bash
# Add a new dependency
poetry add package-name

# Add a development dependency
poetry add --group dev package-name

# Update dependencies
poetry update

# Show dependency tree
poetry show --tree

# Run commands in Poetry environment
poetry run python script.py
poetry run pytest
```

### Database Commands
```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Downgrade migration
alembic downgrade -1

# View current migration
alembic current

# View migration history
alembic history
```

### Testing
```bash
# Run all tests
poetry run pytest

# Run tests with coverage
poetry run pytest --cov=app

# Run specific test file
poetry run pytest tests/test_specific.py

# Run tests in verbose mode
poetry run pytest -v
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Configuration**: Configurable cross-origin policies
- **Input Validation**: Pydantic schemas for request validation
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **Environment-based Configuration**: Secure handling of sensitive data

## 📊 Performance Optimization

- **Async/Await**: Asynchronous request handling
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQLAlchemy queries
- **Response Caching**: Strategic caching for frequently accessed data
- **Pagination**: Efficient data pagination for large datasets

## 🧪 Testing

The project includes comprehensive testing:
- Unit tests for individual functions
- Integration tests for API endpoints
- Database testing with test fixtures
- Authentication and authorization testing

## 🤝 Contributing

1. Follow PEP 8 coding standards
2. Write comprehensive tests for new features
3. Update documentation for API changes
4. Use type hints throughout the codebase
5. Run tests and linting before submitting PRs

### Code Quality Tools
```bash
# Install development dependencies
poetry install

# Run linting
poetry run flake8 app/
poetry run black app/ --check
poetry run isort app/ --check-only

# Auto-format code
poetry run black app/
poetry run isort app/
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Poetry Documentation](https://python-poetry.org/docs/) 