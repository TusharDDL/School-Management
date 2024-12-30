from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
import logging
from .models import School

logger = logging.getLogger('apps.core')

@receiver(pre_save, sender=School)
def handle_school_approval(sender, instance, **kwargs):
    """Signal handler for school approval status changes"""
    try:
        if not instance.pk:  # New instance
            return
            
        old_instance = School.objects.get(pk=instance.pk)
        if not old_instance.is_approved and instance.is_approved:
            # School just got approved
            instance.approval_date = timezone.now()
            logger.info(f"School approved: {instance.name}")
        elif old_instance.is_approved and not instance.is_approved:
            # School approval revoked
            instance.approval_date = None
            logger.warning(f"School approval revoked: {instance.name}")
            
    except School.DoesNotExist:
        logger.error(f"Error in school approval signal: School not found")
    except Exception as e:
        logger.error(f"Error in school approval signal: {str(e)}")
        raise
