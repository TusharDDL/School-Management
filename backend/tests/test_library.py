from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta


def test_list_books(client: TestClient):
    response = client.get("/api/v1/library/books")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_search_books(client: TestClient):
    response = client.get("/api/v1/library/books", params={"search": "physics"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert any("physics" in book["title"].lower() for book in data)


def test_create_book_librarian(client: TestClient, librarian_token: str):
    response = client.post(
        "/api/v1/library/books",
        headers={"Authorization": f"Bearer {librarian_token}"},
        json={
            "title": "Test Book",
            "isbn": "1234567890123",
            "author": "Test Author",
            "publisher": "Test Publisher",
            "category": "Test Category",
            "publication_year": 2024,
            "copies": 5,
            "available_copies": 5,
            "price": 29.99,
            "location": "Shelf A-1",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Book"
    assert data["isbn"] == "1234567890123"
    assert data["copies"] == 5


def test_create_book_unauthorized(client: TestClient, student_token: str):
    response = client.post(
        "/api/v1/library/books",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "title": "Another Book",
            "isbn": "9876543210987",
            "author": "Another Author",
            "publisher": "Another Publisher",
            "category": "Another Category",
            "publication_year": 2024,
            "copies": 3,
            "available_copies": 3,
            "price": 19.99,
            "location": "Shelf B-1",
        },
    )
    assert response.status_code == 403
    assert "Not enough permissions" in response.json()["detail"]


def test_issue_book(client: TestClient, librarian_token: str):
    # First create a library member
    member_response = client.post(
        "/api/v1/library/members",
        headers={"Authorization": f"Bearer {librarian_token}"},
        json={
            "user_id": 3,  # Student user from fixtures
            "membership_type": "Standard",
            "card_number": "LIB-2024-001",
            "start_date": str(date.today()),
            "end_date": str(date.today() + timedelta(days=365)),
            "max_books": 5,
        },
    )
    assert member_response.status_code == 200
    member_id = member_response.json()["id"]

    # Get a book ID
    books_response = client.get("/api/v1/library/books")
    assert books_response.status_code == 200
    books = books_response.json()
    assert books
    book_id = books[0]["id"]

    # Issue the book
    response = client.post(
        "/api/v1/library/circulation",
        headers={"Authorization": f"Bearer {librarian_token}"},
        json={
            "book_id": book_id,
            "member_id": member_id,
            "issue_date": str(date.today()),
            "due_date": str(date.today() + timedelta(days=14)),
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["book_id"] == book_id
    assert data["member_id"] == member_id
    assert data["status"] == "issued"


def test_return_book(client: TestClient, librarian_token: str):
    # Get an issued book
    circulation_response = client.get(
        "/api/v1/library/circulation/overdue",
        headers={"Authorization": f"Bearer {librarian_token}"},
    )
    assert circulation_response.status_code == 200
    circulations = circulation_response.json()

    if circulations:
        circulation_id = circulations[0]["id"]
        response = client.put(
            f"/api/v1/library/circulation/{circulation_id}/return",
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "returned"
        assert data["return_date"] is not None


def test_get_overdue_books(client: TestClient, librarian_token: str):
    response = client.get(
        "/api/v1/library/circulation/overdue",
        headers={"Authorization": f"Bearer {librarian_token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
