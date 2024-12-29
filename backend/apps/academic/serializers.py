from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    AcademicYear,
    Class,
    Section,
    Subject,
    Attendance,
    Assessment,
    AssessmentResult,
    Assignment,
    AssignmentSubmission,
    Timetable,
)
from apps.accounts.serializers import UserSerializer

User = get_user_model()


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ["id", "name", "start_date", "end_date", "is_active", "created_at"]
        read_only_fields = ["created_at"]


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ["id", "name", "description", "created_at"]
        read_only_fields = ["created_at"]


class SectionListSerializer(serializers.ModelSerializer):
    class_name = ClassSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    academic_year = AcademicYearSerializer(read_only=True)
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            "id",
            "name",
            "class_name",
            "teacher",
            "academic_year",
            "student_count",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_student_count(self, obj):
        return obj.students.count()


class SectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name", "class_name", "teacher", "academic_year"]


class SubjectSerializer(serializers.ModelSerializer):
    class_name = ClassSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    class_name_id = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.all(), source="class_name", write_only=True
    )
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="teacher"), source="teacher", write_only=True
    )

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",
            "description",
            "class_name",
            "teacher",
            "class_name_id",
            "teacher_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class AttendanceSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    section = SectionListSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="student"), source="student", write_only=True
    )
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "student",
            "section",
            "date",
            "is_present",
            "remarks",
            "student_id",
            "section_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class AssessmentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    section = SectionListSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source="subject", write_only=True
    )
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )

    class Meta:
        model = Assessment
        fields = [
            "id",
            "name",
            "subject",
            "section",
            "date",
            "total_marks",
            "subject_id",
            "section_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class AssessmentResultSerializer(serializers.ModelSerializer):
    assessment = AssessmentSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    assessment_id = serializers.PrimaryKeyRelatedField(
        queryset=Assessment.objects.all(), source="assessment", write_only=True
    )
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="student"), source="student", write_only=True
    )

    class Meta:
        model = AssessmentResult
        fields = [
            "id",
            "assessment",
            "student",
            "marks_obtained",
            "remarks",
            "assessment_id",
            "student_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def validate(self, data):
        if data["marks_obtained"] > data["assessment"].total_marks:
            raise serializers.ValidationError(
                "Marks obtained cannot be greater than total marks"
            )
        return data


class AssignmentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    section = SectionListSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source="subject", write_only=True
    )
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )
    submission_count = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "subject",
            "section",
            "due_date",
            "file",
            "subject_id",
            "section_id",
            "submission_count",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_submission_count(self, obj):
        return obj.submissions.count()


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=Assignment.objects.all(), source="assignment", write_only=True
    )
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="student"), source="student", write_only=True
    )

    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "assignment",
            "student",
            "file",
            "submitted_at",
            "remarks",
            "score",
            "assignment_id",
            "student_id",
        ]
        read_only_fields = ["submitted_at"]


class TimetableSerializer(serializers.ModelSerializer):
    section = SectionListSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source="subject", write_only=True
    )

    class Meta:
        model = Timetable
        fields = [
            "id",
            "section",
            "subject",
            "weekday",
            "start_time",
            "end_time",
            "section_id",
            "subject_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def validate(self, data):
        # Check for time slot conflicts
        conflicts = Timetable.objects.filter(
            section=data["section"], weekday=data["weekday"]
        ).exclude(id=self.instance.id if self.instance else None)

        for entry in conflicts:
            if (
                (
                    data["start_time"] >= entry.start_time
                    and data["start_time"] < entry.end_time
                )
                or (
                    data["end_time"] > entry.start_time
                    and data["end_time"] <= entry.end_time
                )
                or (
                    data["start_time"] <= entry.start_time
                    and data["end_time"] >= entry.end_time
                )
            ):
                raise serializers.ValidationError(
                    "This time slot conflicts with another entry"
                )

        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("End time must be after start time")

        return data
