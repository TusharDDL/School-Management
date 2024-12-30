from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"announcements", views.AnnouncementViewSet, basename="announcement")
router.register(r"messages", views.MessageViewSet, basename="message")
router.register(r"notifications", views.NotificationViewSet, basename="notification")
router.register(r"email-logs", views.EmailLogViewSet, basename="email-log")
router.register(r"sms-logs", views.SMSLogViewSet, basename="sms-log")

urlpatterns = [
    path("", include(router.urls)),
]
