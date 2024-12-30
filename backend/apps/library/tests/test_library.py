import pytest
from django.urls import reverse
from rest_framework import status
from django_tenants.test.client import TenantClient
from apps.library.models import Book, BookIssue
from apps.accounts.models import User
from apps.core.models import School, Domain
from django_tenants.utils import schema_context
from datetime import datetime, timedelta

@pytest.fixture
def api_client(tenant):
    return TenantClient(tenant)

@pytest.fixture
def test_school(db):
    import uuid
    schema_name = f'test_{uuid.uuid4().hex[:10]}'
    with schema_context('public'):
        school = School.objects.create(
            schema_name=schema_name,
            name='Test School',
            address='123 Test St',
            contact_email='test@school.com',
            contact_phone='1234567890',
            principal_name='Test Principal',
            principal_email='principal@test.com',
            principal_phone='0987654321',
            board_affiliation='CBSE',
            student_strength=100,
            staff_count=20,
            is_approved=True
        )
        Domain.objects.create(
            domain=f'{schema_name}.localhost',
            tenant=school,
            is_primary=True
        )
    return school

@pytest.fixture
def test_librarian(test_school):
    with schema_context(test_school.schema_name):
        librarian = User.objects.create_user(
            username='librarian',
            email='librarian@test.com',
            password='testpass123',
            role='librarian'
        )
        return librarian

@pytest.fixture
def test_student(test_school):
    with schema_context(test_school.schema_name):
        student = User.objects.create_user(
            username='student',
            email='student@test.com',
            password='testpass123',
            role='student'
        )
        return student

@pytest.mark.django_db
class TestLibrary:
    def test_add_book(self, api_client, test_school, test_librarian):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_librarian)
            url = reverse('api:library:book-list')
            data = {
                'title': 'Test Book',
                'author': 'Test Author',
                'isbn': '1234567890123',
                'publisher': 'Test Publisher',
                'quantity': 5,
                'category': 'Fiction',
                'school': test_school.id
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_201_CREATED
            assert Book.objects.count() == 1
            book = Book.objects.first()
            assert book.title == 'Test Book'
            assert book.quantity == 5

    def test_issue_book(self, api_client, test_school, test_librarian, test_student):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_librarian)
            
            # Create a book first
            book = Book.objects.create(
                title='Test Book',
                author='Test Author',
                isbn='1234567890123',
                publisher='Test Publisher',
                quantity=5,
                category='Fiction',
                school=test_school
            )
            
            url = reverse('api:library:bookissue-list')
            data = {
                'book': book.id,
                'student': test_student.id,
                'issue_date': datetime.now().date().isoformat(),
                'due_date': (datetime.now() + timedelta(days=14)).date().isoformat()
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_201_CREATED
            assert BookIssue.objects.count() == 1
            book_issue = BookIssue.objects.first()
            assert book_issue.book == book
            assert book_issue.student == test_student

    def test_return_book(self, api_client, test_school, test_librarian, test_student):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_librarian)
            
            # Create and issue a book
            book = Book.objects.create(
                title='Test Book',
                author='Test Author',
                isbn='1234567890123',
                publisher='Test Publisher',
                quantity=5,
                category='Fiction',
                school=test_school
            )
            
            book_issue = BookIssue.objects.create(
                book=book,
                student=test_student,
                issue_date=datetime.now().date(),
                due_date=(datetime.now() + timedelta(days=14)).date()
            )
            
            url = reverse('api:library:bookissue-return', kwargs={'pk': book_issue.pk})
            response = api_client.post(url)
            assert response.status_code == status.HTTP_200_OK
            book_issue.refresh_from_db()
            assert book_issue.return_date is not None

    def test_book_availability(self, api_client, test_school, test_librarian):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_librarian)
            
            book = Book.objects.create(
                title='Test Book',
                author='Test Author',
                isbn='1234567890123',
                publisher='Test Publisher',
                quantity=1,
                category='Fiction',
                school=test_school
            )
            
            url = reverse('api:library:book-availability', kwargs={'pk': book.pk})
            response = api_client.get(url)
            assert response.status_code == status.HTTP_200_OK
            assert response.data['available'] == 1
