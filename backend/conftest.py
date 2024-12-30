import pytest
from django.core.management import call_command
from django_tenants.utils import schema_context, tenant_context
from django_tenants.middleware import TenantMiddleware
from django_tenants.test.client import TenantClient
from django.test.client import RequestFactory
from django.conf import settings
from django.db import connection
from apps.core.models import School, Domain
from django.utils import timezone

@pytest.fixture(scope='session')
def django_db_setup(django_db_blocker):
    """Set up the test database for multi-tenant testing."""
    with django_db_blocker.unblock():
        # Drop and recreate schemas
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA IF EXISTS public CASCADE")
            cursor.execute("CREATE SCHEMA public")
            cursor.execute("DROP SCHEMA IF EXISTS test_school CASCADE")
            cursor.execute("CREATE SCHEMA test_school")
            cursor.execute("GRANT ALL ON SCHEMA public TO admin")
            cursor.execute("GRANT ALL ON SCHEMA test_school TO admin")
        
        # Run migrations for public schema first
        with schema_context('public'):
            # Temporarily disable django-tenants middleware
            settings.MIDDLEWARE = [m for m in settings.MIDDLEWARE if not m.startswith('django_tenants')]
            settings.DATABASE_ROUTERS = []
            
            # Run all migrations in public schema
            call_command('migrate', verbosity=0, interactive=False)
            
            # Re-enable django-tenants
            settings.MIDDLEWARE.insert(0, 'django_tenants.middleware.TenantMiddleware')
            settings.DATABASE_ROUTERS = ['django_tenants.routers.TenantSyncRouter']

@pytest.fixture(scope='function')
def tenant(django_db_setup, django_db_blocker):
    """Create a test tenant with proper cleanup."""
    from django.contrib.auth import get_user_model
    from django.db import connection
    
    User = get_user_model()
    
    def _create_tenant():
        with schema_context('public'):
            # Clean up any existing test data
            School.objects.filter(schema_name__startswith='test_').delete()
            
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
            
            Domain.objects.create(
                domain='test.localhost',
                tenant=school,
                is_primary=True
            )
            
            return school
    
    def _setup_tenant_schema(school):
        with schema_context('test_school'):
            # Run migrations
            call_command('migrate', verbosity=0, interactive=False)
            
            # Create groups
            from django.contrib.auth.models import Group, Permission
            groups = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'LIBRARIAN', 'ACCOUNTANT']
            created_groups = {}
            for group_name in groups:
                group, _ = Group.objects.get_or_create(name=group_name)
                created_groups[group_name] = group
            
            # Create test admin user
            admin_user = User.objects.create_user(
                username='test_admin',
                email='test_admin@test.com',
                password='testpass123',
                is_staff=True,
                is_superuser=True
            )
            admin_user.groups.add(created_groups['ADMIN'])
            
            # Assign all permissions to admin group
            created_groups['ADMIN'].permissions.add(*Permission.objects.all())
    
    with django_db_blocker.unblock():
        school = _create_tenant()
        _setup_tenant_schema(school)
        
        yield school
        
        # Cleanup after test
        with schema_context('public'):
            School.objects.filter(schema_name__startswith='test_').delete()
            connection.close()


@pytest.fixture
def api_client(tenant):
    """Create a tenant-aware test client."""
    return TenantClient(tenant)

@pytest.fixture(autouse=True)
def use_tenant_context(tenant):
    """Automatically use tenant context for all tests."""
    connection.set_tenant(tenant)
    yield
    connection.set_schema_to_public()

@pytest.fixture(autouse=True)
def cleanup_test_schemas(request):
    """Clean up test schemas after tests."""
    def cleanup():
        with schema_context('public'):
            School.objects.filter(schema_name__startswith='test_').delete()
    
    request.addfinalizer(cleanup)
