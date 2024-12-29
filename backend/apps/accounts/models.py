from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    SUPER_ADMIN = 'super_admin'
    SCHOOL_ADMIN = 'school_admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    PARENT = 'parent'

    ROLE_CHOICES = [
        (SUPER_ADMIN, 'Super Admin'),
        (SCHOOL_ADMIN, 'School Admin'),
        (TEACHER, 'Teacher'),
        (STUDENT, 'Student'),
        (PARENT, 'Parent'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    class Meta:
        ordering = ['first_name', 'last_name']


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    admission_number = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    blood_group = models.CharField(max_length=5, blank=True)
    parent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.admission_number}"


class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    qualification = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField(default=0)
    subjects = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.employee_id}"
