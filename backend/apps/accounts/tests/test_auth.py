import pytest
from django.urls import reverse
from rest_framework import status
from django_tenants.test.client import TenantClient
from apps.accounts.models import User
from apps.core.models import School, Domain
from django_tenants.utils import schema_context

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

@pytest.mark.django_db
class TestAuthentication:
    def test_user_registration(self, api_client, test_school):
        with schema_context(test_school.schema_name):
            url = reverse('api:accounts:user-list')
            data = {
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'testpass123',
                'role': 'teacher',
                'first_name': 'Test',
                'last_name': 'User'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_201_CREATED
            assert User.objects.count() == 1
            user = User.objects.first()
            assert user.username == 'testuser'
            assert user.email == 'test@example.com'
            assert user.role == 'teacher'

    def test_user_login(self, api_client, test_school):
        with schema_context(test_school.schema_name):
            # Create a user first
            user = User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='testpass123',
                role='teacher'
            )
            
            url = reverse('api:accounts:token_obtain_pair')
            data = {
                'username': 'testuser',
                'password': 'testpass123'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_200_OK
            assert 'access' in response.data
            assert 'refresh' in response.data

    def test_token_refresh(self, api_client, test_school):
        with schema_context(test_school.schema_name):
            # Create a user and get initial tokens
            user = User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='testpass123',
                role='teacher'
            )
            
            # Get initial tokens
            url = reverse('api:accounts:token_obtain_pair')
            response = api_client.post(url, {
                'username': 'testuser',
                'password': 'testpass123'
            })
            refresh_token = response.data['refresh']
            
            # Try to refresh the token
            url = reverse('api:accounts:token_refresh')
            response = api_client.post(url, {'refresh': refresh_token})
            assert response.status_code == status.HTTP_200_OK
            assert 'access' in response.data

    def test_invalid_login(self, api_client, test_school):
        with schema_context(test_school.schema_name):
            url = reverse('api:accounts:token_obtain_pair')
            data = {
                'username': 'nonexistent',
                'password': 'wrongpass'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_password_change(self, api_client, test_school):
        with schema_context(test_school.schema_name):
            user = User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='testpass123',
                role='teacher'
            )
            
            # Login first
            api_client.force_authenticate(user=user)
            
            url = reverse('api:accounts:user-change-password', kwargs={'pk': user.pk})
            data = {
                'old_password': 'testpass123',
                'new_password': 'newtestpass123'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_200_OK
            
            # Verify new password works
            url = reverse('api:accounts:token_obtain_pair')
            data = {
                'username': 'testuser',
                'password': 'newtestpass123'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_200_OK
