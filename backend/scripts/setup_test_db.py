import os
import sys
import django
from pathlib import Path

# Add the project root directory to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from django_tenants.utils import schema_exists
from apps.core.models import School, Domain
from django.utils import timezone

def setup_test_database():
    # Create test schema if it doesn't exist
    schema_name = 'test_school'
    if not schema_exists(schema_name):
        with connection.cursor() as cursor:
            cursor.execute(f'CREATE SCHEMA IF NOT EXISTS {schema_name}')
            cursor.execute(f'GRANT ALL ON SCHEMA {schema_name} TO admin')
            print(f'Created schema: {schema_name}')
    
    # Create test school if it doesn't exist
    try:
        school = School.objects.get(schema_name=schema_name)
        print('Test school already exists')
    except School.DoesNotExist:
        school = School.objects.create(
            schema_name=schema_name,
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
        print('Created test school')
    
    # Create domain if it doesn't exist
    if not Domain.objects.filter(domain='test.localhost', tenant=school).exists():
        Domain.objects.create(
            domain='test.localhost',
            tenant=school,
            is_primary=True
        )
        print('Created test domain')
    else:
        print('Test domain already exists')

if __name__ == '__main__':
    setup_test_database()
