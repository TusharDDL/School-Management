from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django_tenants.models import TenantMixin, DomainMixin
from django.conf import settings


class School(TenantMixin):
    # Basic Information
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    # School Details
    board_affiliation = models.CharField(max_length=50, choices=[
        ('CBSE', 'Central Board of Secondary Education'),
        ('ICSE', 'Indian Certificate of Secondary Education'),
        ('STATE', 'State Board'),
    ])
    student_strength = models.PositiveIntegerField(
        validators=[MaxValueValidator(500)],
        help_text="Maximum 500 students allowed in free tier"
    )
    staff_count = models.PositiveIntegerField(
        validators=[MaxValueValidator(50)],
        help_text="Maximum 50 staff members allowed in free tier"
    )
    
    # Principal/Admin Details
    principal_name = models.CharField(max_length=100)
    principal_email = models.EmailField()
    principal_phone = models.CharField(max_length=20)
    
    # Approval Status
    is_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Academic Year Configuration
    academic_year_start = models.IntegerField(
        choices=[(4, 'April'), (6, 'June')],
        default=4,
        help_text="Month when academic year starts"
    )
    academic_year_end = models.IntegerField(
        choices=[(3, 'March'), (5, 'May')],
        default=3,
        help_text="Month when academic year ends"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name
        
    def save(self, *args, **kwargs):
        from .exceptions import SchoolApprovalError, FreeTierLimitExceeded, EmailDeliveryError
        import logging
        logger = logging.getLogger('apps.core')
        
        creating = not self.pk  # Check if this is a new instance
        
        # Validate student and staff counts
        if self.student_strength > 500:
            logger.error(f"School {self.name} exceeded free tier student limit: {self.student_strength}")
            raise FreeTierLimitExceeded("Free tier allows maximum of 500 students")
        
        if self.staff_count > 50:
            logger.error(f"School {self.name} exceeded free tier staff limit: {self.staff_count}")
            raise FreeTierLimitExceeded("Free tier allows maximum of 50 staff members")
            
        try:
            super().save(*args, **kwargs)
            logger.info(f"School {self.name} {'created' if creating else 'updated'}")
            
            if creating and self.is_approved:
                from apps.accounts.models import User
                try:
                    # Create school admin user
                    admin_user = User.objects.create_user(
                        username=f"admin_{self.name.lower().replace(' ', '_')}",
                        email=self.principal_email,
                        first_name=self.principal_name.split()[0],
                        last_name=' '.join(self.principal_name.split()[1:]),
                        role=User.SCHOOL_ADMIN,
                        phone=self.principal_phone,
                    )
                    logger.info(f"Created admin user for school: {self.name}")
                    
                    # Generate a random password
                    import secrets
                    import string
                    password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
                    admin_user.set_password(password)
                    admin_user.save()
                    
                    # Send credentials email
                    from django.core.mail import send_mail
                    from django.template.loader import render_to_string
                    
                    context = {
                        'school_name': self.name,
                        'username': admin_user.username,
                        'password': password,
                        'login_url': settings.FRONTEND_URL + '/login'
                    }
                    
                    send_mail(
                        subject=f'Welcome to School Management System - {self.name}',
                        message=render_to_string('emails/school_approved.txt', context),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[self.principal_email],
                        html_message=render_to_string('emails/school_approved.html', context)
                    )
                    logger.info(f"Sent welcome email to school admin: {self.principal_email}")
                    
                except User.DoesNotExist as e:
                    logger.error(f"Failed to create admin user for school {self.name}: {str(e)}")
                    raise SchoolApprovalError(f"Failed to create admin user: {str(e)}")
                except Exception as e:
                    logger.error(f"Error in school approval process for {self.name}: {str(e)}")
                    raise SchoolApprovalError(f"School approval process failed: {str(e)}")

                try:
                    # Send credentials email
                    from django.core.mail import send_mail
                    from django.template.loader import render_to_string
                    
                    context = {
                        'school_name': self.name,
                        'username': admin_user.username,
                        'password': password,
                        'login_url': settings.FRONTEND_URL + '/login'
                    }
                    
                    send_mail(
                        subject=f'Welcome to School Management System - {self.name}',
                        message=render_to_string('emails/school_approved.txt', context),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[self.principal_email],
                        html_message=render_to_string('emails/school_approved.html', context)
                    )
                    logger.info(f"Sent welcome email to school admin: {self.principal_email}")
                except Exception as e:
                    logger.error(f"Failed to send welcome email to {self.principal_email}: {str(e)}")
                    raise EmailDeliveryError(f"Failed to send welcome email: {str(e)}")
        except Exception as e: 
            logger.error(f"Error saving school {self.name}: {str(e)}")
            raise


class Domain(DomainMixin):
    pass
