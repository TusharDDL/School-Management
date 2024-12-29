from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_login_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "wrongpass"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_register_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@test.com",
            "username": "newuser",
            "password": "newpass123",
            "first_name": "New",
            "last_name": "User",
            "role": "student",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["username"] == "newuser"
    assert data["role"] == "student"

def test_register_duplicate_email(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@test.com",  # Already exists
            "username": "uniqueuser",
            "password": "pass123",
            "first_name": "Unique",
            "last_name": "User",
            "role": "student",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_me_endpoint(client: TestClient, admin_token: str):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"
    assert data["username"] == "admin"
    assert data["role"] == "admin"

def test_me_endpoint_no_token(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
