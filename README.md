# School Management System

A comprehensive multi-tenant School Management System built with Next.js and Django.

## Features

- Multi-tenant architecture (each school as a separate tenant)
- Role-based access control (Super Admin, School Admin, Teacher, Student, Parent)
- Complete academic management (classes, sections, timetables)
- Student management with attendance and performance tracking
- Financial management with fee tracking
- Communication system with announcements and notifications

## Tech Stack

### Frontend
- Next.js (Latest) with TypeScript
- TailwindCSS + shadcn/ui components
- React Query for data fetching
- React Hook Form for form handling
- ESLint + Prettier

### Backend
- Django + Django REST Framework
- PostgreSQL database
- JWT authentication
- Multi-tenancy support
- Redis (optional, for caching)

## Project Structure

```
school-management-system/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and constants
│   │   ├── services/     # API service functions
│   │   └── types/        # TypeScript type definitions
│   └── ...
│
├── backend/               # Django backend application
│   ├── config/           # Django project settings
│   ├── apps/             # Django applications
│   │   ├── core/         # Core functionality
│   │   ├── accounts/     # User management
│   │   ├── academic/     # Academic management
│   │   ├── finance/      # Financial management
│   │   └── communication/# Communication system
│   └── ...
│
└── docker/               # Docker configuration files
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 14+

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-management-system.git
   cd school-management-system
   ```

2. Create environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/

### Local Development Setup

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run development server:
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## API Documentation

The API documentation is available at `/api/docs/` when running the backend server. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.