from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class School(TenantMixin):
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass
