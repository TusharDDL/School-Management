from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.accounts.models import User


class AcademicYear(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-start_date"]


class Class(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Classes"
        ordering = ["name"]


class Section(models.Model):
    name = models.CharField(max_length=50)
    class_name = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="sections"
    )
    teacher = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="sections"
    )
    academic_year = models.ForeignKey(
        AcademicYear, on_delete=models.CASCADE, related_name="sections"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.class_name} - {self.name}"

    class Meta:
        unique_together = ["name", "class_name", "academic_year"]
        ordering = ["class_name", "name"]


class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    class_name = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="subjects"
    )
    teacher = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="subjects"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Attendance(models.Model):
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="attendances"
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="attendances"
    )
    date = models.DateField()
    is_present = models.BooleanField(default=True)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["student", "section", "date"]
        ordering = ["-date"]


class Assessment(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="assessments"
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="assessments"
    )
    date = models.DateField()
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"


class AssessmentResult(models.Model):
    assessment = models.ForeignKey(
        Assessment, on_delete=models.CASCADE, related_name="results"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assessment_results"
    )
    marks_obtained = models.PositiveIntegerField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["assessment", "student"]

    def clean(self):
        if self.marks_obtained > self.assessment.total_marks:
            raise ValueError("Marks obtained cannot be greater than total marks")


class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="assignments"
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="assignments"
    )
    due_date = models.DateTimeField()
    file = models.FileField(upload_to="assignments/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(
        Assignment, on_delete=models.CASCADE, related_name="submissions"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assignment_submissions"
    )
    file = models.FileField(upload_to="assignment_submissions/")
    submitted_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)
    score = models.PositiveIntegerField(
        null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    class Meta:
        unique_together = ["assignment", "student"]


class Timetable(models.Model):
    WEEKDAY_CHOICES = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="timetable_entries"
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="timetable_entries"
    )
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["section", "weekday", "start_time"]
        ordering = ["weekday", "start_time"]

    def __str__(self):
        return f"{self.get_weekday_display()} - {self.subject} ({self.start_time} to {self.end_time})"
