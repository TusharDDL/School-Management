from django.db import models
from django.core.validators import MinValueValidator
from apps.accounts.models import User
from apps.academic.models import Class, Section


class FeeCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Fee Categories"


class FeeStructure(models.Model):
    FREQUENCY_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("semi_annual", "Semi Annual"),
        ("annual", "Annual"),
        ("one_time", "One Time"),
    ]

    category = models.ForeignKey(
        FeeCategory, on_delete=models.CASCADE, related_name="fee_structures"
    )
    class_name = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="fee_structures"
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    academic_year = models.CharField(max_length=9)  # Format: 2023-2024
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category} - {self.class_name} ({self.academic_year})"

    class Meta:
        unique_together = ["category", "class_name", "academic_year"]


class Discount(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed Amount"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    value = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_discount_type_display()})"


class StudentFee(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("partial", "Partially Paid"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fees")
    fee_structure = models.ForeignKey(
        FeeStructure, on_delete=models.CASCADE, related_name="student_fees"
    )
    discount = models.ForeignKey(
        Discount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_fees",
    )
    due_date = models.DateField()
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    paid_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)]
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.fee_structure.category}"

    @property
    def balance(self):
        return self.amount - self.paid_amount


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash"),
        ("bank_transfer", "Bank Transfer"),
        ("card", "Card Payment"),
        ("upi", "UPI"),
        ("cheque", "Cheque"),
    ]

    student_fee = models.ForeignKey(
        StudentFee, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_fee.student.get_full_name()} - {self.amount}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update StudentFee paid amount and status
        student_fee = self.student_fee
        total_paid = (
            student_fee.payments.aggregate(models.Sum("amount"))["amount__sum"] or 0
        )
        student_fee.paid_amount = total_paid
        if total_paid >= student_fee.amount:
            student_fee.status = "paid"
        elif total_paid > 0:
            student_fee.status = "partial"
        student_fee.save()
