from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import FeeCategory, FeeStructure, Discount, StudentFee, Payment
from .serializers import (
    FeeCategorySerializer,
    FeeStructureSerializer,
    FeeDiscountSerializer,
    PaymentSerializer
)
from apps.core.permissions import IsSchoolAdmin


class FeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = FeeCategory.objects.all()
    serializer_class = FeeCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsSchoolAdmin]

    def get_queryset(self):
        return FeeCategory.objects.filter(school=self.request.user.school)

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)


class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [permissions.IsAuthenticated, IsSchoolAdmin]

    def get_queryset(self):
        return FeeStructure.objects.filter(school=self.request.user.school)

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)


class FeeDiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = FeeDiscountSerializer
    permission_classes = [permissions.IsAuthenticated, IsSchoolAdmin]

    def get_queryset(self):
        return Discount.objects.filter(school=self.request.user.school)

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(student_fee__student__school=self.request.user.school)

    def perform_create(self, serializer):
        student_fee = serializer.validated_data['student_fee']
        if student_fee.student.school != self.request.user.school:
            raise permissions.PermissionDenied("Cannot create payment for student from different school")
        serializer.save()

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_payments = self.get_queryset().aggregate(
            total=Sum('amount')
        )['total'] or 0
        return Response({
            'total_payments': total_payments
        })
