import pytest
from django.urls import reverse
from rest_framework import status
from django_tenants.test.client import TenantClient
from apps.academic.models import AcademicYear
from apps.core.models import School, Domain
from apps.accounts.models import User
from django_tenants.utils import schema_context
from datetime import date

@pytest.fixture
def api_client():
    return TenantClient()

@pytest.fixture
def test_school(db):
    import uuid
    from django.core.management import call_command
    
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
            academic_year_start=4,
            academic_year_end=3,
            is_approved=True
        )
        Domain.objects.create(
            domain=f'{schema_name}.localhost',
            tenant=school,
            is_primary=True
        )
        
    # Apply migrations to the new tenant schema
    with schema_context(schema_name):
        call_command('migrate_schemas', schema_name=schema_name, interactive=False)
        
    return school

@pytest.fixture
def test_user(test_school):
    with schema_context(test_school.schema_name):
        user = User.objects.create_user(
            username='testadmin',
            email='testadmin@test.com',
            password='testpass123',
            role='school_admin'
        )
        user.school = test_school
        user.save()
        return user

@pytest.fixture
def authenticated_client(api_client, test_user, test_school):
    api_client.tenant = test_school
    api_client.tenant.domain_url = f'{test_school.schema_name}.localhost'
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.mark.django_db
class TestAcademicYear:
    def test_create_academic_year(self, authenticated_client, test_school):
        with schema_context(test_school.schema_name):
            url = reverse('api:academic:academicyear-list')
            data = {
                'name': '2024-2025',
                'start_date': '2024-04-01',
                'end_date': '2025-03-31',
                'school': test_school.id
            }
            response = authenticated_client.post(url, data)
            assert response.status_code == status.HTTP_201_CREATED
            assert AcademicYear.objects.count() == 1
            academic_year = AcademicYear.objects.first()
            assert academic_year.name == '2024-2025'
            assert academic_year.school == test_school

    def test_create_overlapping_academic_year(self, authenticated_client, test_school):
        with schema_context(test_school.schema_name):
            # Create first academic year
            AcademicYear.objects.create(
                name='2024-2025',
                start_date=date(2024, 4, 1),
                end_date=date(2025, 3, 31),
                school=test_school
            )

            url = reverse('api:academic:academicyear-list')
            data = {
                'name': '2024-2025 Overlap',
                'start_date': '2024-06-01',
                'end_date': '2025-05-31',
                'school': test_school.id
            }
            response = authenticated_client.post(url, data)
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert 'Academic year dates overlap' in str(response.content)

    def test_list_academic_years(self, authenticated_client, test_school):
        with schema_context(test_school.schema_name):
            # Create test academic years
            AcademicYear.objects.create(
                name='2024-2025',
                start_date=date(2024, 4, 1),
                end_date=date(2025, 3, 31),
                school=test_school
            )
            AcademicYear.objects.create(
                name='2025-2026',
                start_date=date(2025, 4, 1),
                end_date=date(2026, 3, 31),
                school=test_school
            )


            url = reverse('api:academic:academicyear-list')
            response = authenticated_client.get(url)
            assert response.status_code == status.HTTP_200_OK
            assert len(response.data) == 2

    def test_update_academic_year(self, authenticated_client, test_school):
        with schema_context(test_school.schema_name):
            academic_year = AcademicYear.objects.create(
                name='2024-2025',
                start_date=date(2024, 4, 1),
                end_date=date(2025, 3, 31),
                school=test_school
            )

            url = reverse('api:academic:academicyear-detail', kwargs={'pk': academic_year.pk})
            data = {
                'name': '2024-2025 Updated',
                'start_date': '2024-04-01',
                'end_date': '2025-03-31',
                'school': test_school.id
            }
            response = authenticated_client.put(url, data)
            assert response.status_code == status.HTTP_200_OK
            academic_year.refresh_from_db()
            assert academic_year.name == '2024-2025 Updated'

    def test_delete_academic_year(self, authenticated_client, test_school):
        with schema_context(test_school.schema_name):
            academic_year = AcademicYear.objects.create(
                name='2024-2025',
                start_date=date(2024, 4, 1),
                end_date=date(2025, 3, 31),
                school=test_school
            )

            url = reverse('api:academic:academicyear-detail', kwargs={'pk': academic_year.pk})
            response = authenticated_client.delete(url)
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert AcademicYear.objects.count() == 0
