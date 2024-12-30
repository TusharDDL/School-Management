from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"fee-structures", views.FeeStructureViewSet)
router.register(r"payments", views.PaymentViewSet)
router.register(r"fee-categories", views.FeeCategoryViewSet)
router.register(r"fee-discounts", views.FeeDiscountViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
