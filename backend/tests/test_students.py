from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date


def test_list_students_admin(client: TestClient, admin_token: str):
    response = client.get(
        "/api/v1/students",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_students_teacher(client: TestClient, teacher_token: str):
    response = client.get(
        "/api/v1/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_students_unauthorized(client: TestClient, student_token: str):
    response = client.get(
        "/api/v1/students",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert response.status_code == 403
    assert "Not enough permissions" in response.json()["detail"]


def test_create_student_success(client: TestClient, admin_token: str):
    response = client.post(
        "/api/v1/students",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "admission_number": "2024001",
            "roll_number": "101",
            "class_name": "Class 10",
            "section": "A",
            "date_of_birth": str(date(2008, 1, 1)),
            "gender": "male",
            "parent_name": "Parent Name",
            "parent_phone": "1234567890",
            "parent_email": "parent@test.com",
            "user_id": 3,  # Student user created in fixtures
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["admission_number"] == "2024001"
    assert data["class_name"] == "Class 10"
    assert data["section"] == "A"


def test_create_student_unauthorized(client: TestClient, teacher_token: str):
    response = client.post(
        "/api/v1/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "admission_number": "2024002",
            "roll_number": "102",
            "class_name": "Class 10",
            "section": "A",
            "date_of_birth": str(date(2008, 1, 1)),
            "gender": "female",
            "parent_name": "Parent Name",
            "parent_phone": "1234567890",
            "parent_email": "parent2@test.com",
            "user_id": 4,
        },
    )
    assert response.status_code == 403
    assert "Not enough permissions" in response.json()["detail"]


def test_get_students_by_class_section(client: TestClient, admin_token: str):
    response = client.get(
        "/api/v1/students/class/Class 10/section/A",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert all(s["class_name"] == "Class 10" and s["section"] == "A" for s in data)
