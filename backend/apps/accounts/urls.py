from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"students", views.StudentProfileViewSet)
router.register(r"teachers", views.TeacherProfileViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
