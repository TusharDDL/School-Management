from rest_framework import serializers
from .models import FeeCategory, FeeStructure, Discount, StudentFee, Payment


class FeeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeCategory
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = [
            'id', 'category', 'class_name', 'amount', 'frequency',
            'academic_year', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class FeeDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = [
            'id', 'name', 'description', 'discount_type', 'value',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'student_fee', 'amount', 'payment_method',
            'transaction_id', 'payment_date', 'remarks', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
