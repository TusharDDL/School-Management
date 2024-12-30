from django.utils import timezone
from apps.core.models import School, Domain

def create_test_tenant():
    try:
        # Check if test school already exists
        if not School.objects.filter(schema_name='test_school').exists():
            # Create test school
            school = School.objects.create(
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
            print('Test school created successfully')
        else:
            school = School.objects.get(schema_name='test_school')
            print('Test school already exists')

        # Create domain if it doesn't exist
        if not Domain.objects.filter(domain='test.localhost', tenant=school).exists():
            Domain.objects.create(
                domain='test.localhost',
                tenant=school,
                is_primary=True
            )
            print('Test domain created successfully')
        else:
            print('Test domain already exists')

    except Exception as e:
        print(f'Error: {str(e)}')

if __name__ == '__main__':
    create_test_tenant()
