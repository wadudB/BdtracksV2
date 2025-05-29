# BDTracks

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **TanStack Query** for API state management
- **React Router Dom** for navigation
- **Tailwind CSS** for styling
- **Radix UI** components
- **Shadcn/ui** component library
- **Google Maps API** for interactive maps
- **Vite** for fast development and building

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **MySQL** - Relational database
- **Pydantic** - Data validation
- **Python-Jose** - JWT token handling
- **Poetry** - Python dependency management

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and npm
- Python 3.11+
- MySQL 8.0+
- Poetry (for Python dependency management)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BdtracksV2
```

### 2. Backend Setup
```bash
cd backend
poetry install
cp .env.example .env  # Configure your database credentials
alembic upgrade head
poetry run uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
BdtracksV2/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── public/
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── crud/          # Database operations
│   │   └── core/          # Core functionality
│   └── alembic/           # Database migrations
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a develop branch (`git checkout -b develop/your-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin develop/your-name`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
