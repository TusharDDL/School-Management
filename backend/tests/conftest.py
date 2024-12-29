import asyncio
import pytest
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User, UserRole
from app.core.auth import get_password_hash

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db() -> Generator:
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="session")
def client(db: TestingSessionLocal) -> Generator:
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="session")
def admin_token(client: TestClient, db: TestingSessionLocal) -> str:
    # Create admin user
    admin = User(
        email="admin@test.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
    )
    db.add(admin)
    db.commit()

    # Get token
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    return response.json()["access_token"]

@pytest.fixture(scope="session")
def teacher_token(client: TestClient, db: TestingSessionLocal) -> str:
    # Create teacher user
    teacher = User(
        email="teacher@test.com",
        username="teacher",
        hashed_password=get_password_hash("teacher123"),
        first_name="Teacher",
        last_name="User",
        role=UserRole.TEACHER,
        is_active=True,
        is_verified=True,
    )
    db.add(teacher)
    db.commit()

    # Get token
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "teacher", "password": "teacher123"},
    )
    return response.json()["access_token"]

@pytest.fixture(scope="session")
def student_token(client: TestClient, db: TestingSessionLocal) -> str:
    # Create student user
    student = User(
        email="student@test.com",
        username="student",
        hashed_password=get_password_hash("student123"),
        first_name="Student",
        last_name="User",
        role=UserRole.STUDENT,
        is_active=True,
        is_verified=True,
    )
    db.add(student)
    db.commit()

    # Get token
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "student", "password": "student123"},
    )
    return response.json()["access_token"]

@pytest.fixture(scope="session")
def librarian_token(client: TestClient, db: TestingSessionLocal) -> str:
    # Create librarian user
    librarian = User(
        email="librarian@test.com",
        username="librarian",
        hashed_password=get_password_hash("librarian123"),
        first_name="Librarian",
        last_name="User",
        role=UserRole.LIBRARIAN,
        is_active=True,
        is_verified=True,
    )
    db.add(librarian)
    db.commit()

    # Get token
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "librarian", "password": "librarian123"},
    )
    return response.json()["access_token"]
