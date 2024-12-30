from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Announcement, Notification, Message, EmailLog, SMSLog
from .serializers import (
    AnnouncementSerializer,
    NotificationSerializer,
    MessageSerializer,
    EmailLogSerializer,
    SMSLogSerializer,
)
from apps.core.permissions import IsSchoolAdmin, IsOwnerOrAdmin


class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated & (IsSchoolAdmin | IsOwnerOrAdmin)]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Announcement.objects.all()
        elif user.role == 'SCHOOL_ADMIN':
            return Announcement.objects.filter(author__school=user.school)
        else:
            return Announcement.objects.filter(
                target_roles__contains=[user.role],
                is_active=True
            ).filter(
                models.Q(target_classes__in=[user.student.class_enrolled]) |
                models.Q(target_sections__in=[user.student.section]) |
                models.Q(target_classes__isnull=True, target_sections__isnull=True)
            ).distinct()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient == request.user:
            message.is_read = True
            message.save()
            return Response({'status': 'message marked as read'})
        return Response(
            {'error': 'You are not the recipient of this message'},
            status=status.HTTP_403_FORBIDDEN
        )


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EmailLogSerializer
    permission_classes = [permissions.IsAuthenticated & IsSchoolAdmin]

    def get_queryset(self):
        return EmailLog.objects.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))


class SMSLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SMSLogSerializer
    permission_classes = [permissions.IsAuthenticated & IsSchoolAdmin]

    def get_queryset(self):
        return SMSLog.objects.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))
