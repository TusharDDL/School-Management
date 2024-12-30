import pytest
from django.urls import reverse
from rest_framework import status
from django_tenants.test.client import TenantClient
from apps.accounts.models import User, StudentProfile
from apps.core.models import School, Domain
from django_tenants.utils import schema_context

@pytest.fixture
def api_client():
    return TenantClient()

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
def test_admin(test_school):
    with schema_context(test_school.schema_name):
        admin = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='testpass123',
            role='school_admin'
        )
        return admin

@pytest.mark.django_db
class TestStudents:
    def test_create_student(self, api_client, test_school, test_admin):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_admin)
            url = reverse('api:accounts:student-list')
            data = {
                'username': 'student1',
                'email': 'student1@test.com',
                'password': 'testpass123',
                'first_name': 'Test',
                'last_name': 'Student',
                'role': 'student',
                'admission_number': 'ADM001',
                'date_of_birth': '2010-01-01',
                'gender': 'M',
                'blood_group': 'O+',
                'address': '123 Student St',
                'parent_name': 'Parent Name',
                'parent_phone': '1234567890',
                'parent_email': 'parent@test.com'
            }
            response = api_client.post(url, data)
            assert response.status_code == status.HTTP_201_CREATED
            assert User.objects.filter(role='student').count() == 1
            assert StudentProfile.objects.count() == 1
            student = User.objects.get(username='student1')
            assert student.studentprofile.admission_number == 'ADM001'

    def test_list_students(self, api_client, test_school, test_admin):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_admin)
            
            # Create multiple students
            for i in range(3):
                user = User.objects.create_user(
                    username=f'student{i}',
                    email=f'student{i}@test.com',
                    password='testpass123',
                    role='student'
                )
                StudentProfile.objects.create(
                    user=user,
                    admission_number=f'ADM00{i}',
                    date_of_birth='2010-01-01',
                    gender='M',
                    blood_group='O+',
                    address='123 Student St',
                    parent_name='Parent Name',
                    parent_phone='1234567890',
                    parent_email=f'parent{i}@test.com'
                )
            
            url = reverse('api:accounts:student-list')
            response = api_client.get(url)
            assert response.status_code == status.HTTP_200_OK
            assert len(response.data) == 3

    def test_update_student(self, api_client, test_school, test_admin):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_admin)
            
            # Create a student
            user = User.objects.create_user(
                username='student1',
                email='student1@test.com',
                password='testpass123',
                role='student'
            )
            profile = StudentProfile.objects.create(
                user=user,
                admission_number='ADM001',
                date_of_birth='2010-01-01',
                gender='M',
                blood_group='O+',
                address='123 Student St',
                parent_name='Parent Name',
                parent_phone='1234567890',
                parent_email='parent@test.com'
            )
            
            url = reverse('api:accounts:student-detail', kwargs={'pk': user.pk})
            data = {
                'first_name': 'Updated',
                'last_name': 'Student',
                'admission_number': 'ADM001',
                'date_of_birth': '2010-01-01',
                'gender': 'M',
                'blood_group': 'A+',
                'address': 'Updated Address',
                'parent_name': 'Updated Parent',
                'parent_phone': '0987654321',
                'parent_email': 'updatedparent@test.com'
            }
            response = api_client.put(url, data)
            assert response.status_code == status.HTTP_200_OK
            profile.refresh_from_db()
            assert profile.blood_group == 'A+'
            assert profile.parent_name == 'Updated Parent'

    def test_delete_student(self, api_client, test_school, test_admin):
        with schema_context(test_school.schema_name):
            api_client.force_authenticate(user=test_admin)
            
            # Create a student
            user = User.objects.create_user(
                username='student1',
                email='student1@test.com',
                password='testpass123',
                role='student'
            )
            StudentProfile.objects.create(
                user=user,
                admission_number='ADM001',
                date_of_birth='2010-01-01',
                gender='M',
                blood_group='O+',
                address='123 Student St',
                parent_name='Parent Name',
                parent_phone='1234567890',
                parent_email='parent@test.com'
            )
            
            url = reverse('api:accounts:student-detail', kwargs={'pk': user.pk})
            response = api_client.delete(url)
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert User.objects.filter(role='student').count() == 0
            assert StudentProfile.objects.count() == 0
