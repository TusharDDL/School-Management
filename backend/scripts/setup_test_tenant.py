from django.utils import timezone
from apps.core.models import School, Domain

def create_test_tenant():
    try:
        # Try to get existing test school
        school = School.objects.get(schema_name='test_school')
        print('Test school already exists')
    except School.DoesNotExist:
        # Create new test school
        school = School(
            schema_name='test_school',
            name='Test School',
            address='Test Address',
            contact_email='test@school.com',
            contact_phone='1234567890',
            board_affiliation='CBSE',
            student_strength=100,
            staff_count=10,
            principal_name='Test Principal',
            principal_email='principal@test.com',
            principal_phone='0987654321',
            is_approved=True,
            approval_date=timezone.now(),
            academic_year_start=4,
            academic_year_end=3
        )
        school.save()
        print('Test school created successfully')

    try:
        # Try to get existing domain
        domain = Domain.objects.get(tenant=school)
        print('Test domain already exists')
    except Domain.DoesNotExist:
        # Create new domain
        Domain.objects.create(
            domain='test.localhost',
            tenant=school,
            is_primary=True
        )
        print('Test domain created successfully')

if __name__ == '__main__':
    create_test_tenant()
