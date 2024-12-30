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
from django_tenants.utils import schema_exists, get_tenant_model, get_tenant_domain_model
from django.core.management import call_command
from django.utils import timezone

def setup_test_environment():
    """Set up the test environment with proper schema and migrations."""
    try:
        # Drop and recreate database
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA IF EXISTS public CASCADE")
            cursor.execute("CREATE SCHEMA public")
            cursor.execute("DROP SCHEMA IF EXISTS test_school CASCADE")
            cursor.execute("CREATE SCHEMA test_school")
            # Grant permissions
            cursor.execute("GRANT ALL ON SCHEMA public TO admin")
            cursor.execute("GRANT ALL ON SCHEMA test_school TO admin")
        
        print("Schemas reset successfully")

        # Run shared migrations first
        call_command('migrate_schemas', schema_name='public', verbosity=1, interactive=False)
        print("Public schema migrations completed")

        # Create test tenant
        TenantModel = get_tenant_model()
        DomainModel = get_tenant_domain_model()

        if not TenantModel.objects.filter(schema_name='test_school').exists():
            tenant = TenantModel.objects.create(
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
            print("Test tenant created")

            # Create domain for tenant
            domain = DomainModel.objects.create(
                domain='test.localhost',
                tenant=tenant,
                is_primary=True
            )
            print("Test domain created")

        # Run migrations for test tenant
        call_command('migrate_schemas', schema_name='test_school', verbosity=1, interactive=False)
        print("Test tenant migrations completed")

        print("Test environment setup completed successfully")
        return True

    except Exception as e:
        print(f"Error setting up test environment: {str(e)}")
        return False

if __name__ == '__main__':
    setup_test_environment()
