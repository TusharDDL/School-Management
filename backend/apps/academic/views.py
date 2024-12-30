from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
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
from .serializers import (
    AcademicYearSerializer,
    ClassSerializer,
    SectionListSerializer,
    SectionCreateSerializer,
    SubjectSerializer,
    AttendanceSerializer,
    AssessmentSerializer,
    AssessmentResultSerializer,
    AssignmentSerializer,
    AssignmentSubmissionSerializer,
    TimetableSerializer,
)
from apps.accounts.permissions import IsAdminUser, IsTeacherUser, IsStudentUser

User = get_user_model()


class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["start_date", "name"]
    ordering = ["-start_date"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return super().get_permissions()


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]
    ordering = ["name"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return super().get_permissions()


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "class_name__name"]
    ordering_fields = ["name", "class_name__name"]
    ordering = ["class_name__name", "name"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SectionCreateSerializer
        return SectionListSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Section.objects.all()
        elif user.role == "school_admin":
            return Section.objects.filter(academic_year__school=user.school)
        elif user.role == "teacher":
            return Section.objects.filter(
                Q(teacher=user) | Q(subjects__teacher=user)
            ).distinct()
        elif user.role == "student":
            return Section.objects.filter(students=user)
        return Section.objects.none()

    @action(detail=True, methods=["post"])
    def add_students(self, request, pk=None):
        section = self.get_object()
        student_ids = request.data.get("student_ids", [])
        students = User.objects.filter(id__in=student_ids, role="student")
        section.students.add(*students)
        return Response({"status": "Students added successfully"})

    @action(detail=True, methods=["post"])
    def remove_students(self, request, pk=None):
        section = self.get_object()
        student_ids = request.data.get("student_ids", [])
        students = User.objects.filter(id__in=student_ids, role="student")
        section.students.remove(*students)
        return Response({"status": "Students removed successfully"})


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code", "class_name__name"]
    ordering_fields = ["name", "code", "class_name__name"]
    ordering = ["class_name__name", "name"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Subject.objects.all()
        elif user.role == "school_admin":
            return Subject.objects.filter(class_name__school=user.school)
        elif user.role == "teacher":
            return Subject.objects.filter(teacher=user)
        elif user.role == "student":
            return Subject.objects.filter(class_name__sections__students=user)
        return Subject.objects.none()


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student__username", "section__name"]
    ordering_fields = ["date", "student__username"]
    ordering = ["-date"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return [IsTeacherUser()]
        elif self.action == "destroy":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Attendance.objects.all()
        elif user.role == "school_admin":
            return Attendance.objects.filter(section__school=user.school)
        elif user.role == "teacher":
            return Attendance.objects.filter(section__teacher=user)
        elif user.role == "student":
            return Attendance.objects.filter(student=user)
        return Attendance.objects.none()

    @action(detail=False, methods=["post"])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_bulk_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_bulk_create(self, serializer):
        serializer.save()


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "subject__name", "section__name"]
    ordering_fields = ["date", "name"]
    ordering = ["-date"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return [IsTeacherUser()]
        elif self.action == "destroy":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Assessment.objects.all()
        elif user.role == "school_admin":
            return Assessment.objects.filter(section__school=user.school)
        elif user.role == "teacher":
            return Assessment.objects.filter(
                Q(section__teacher=user) | Q(subject__teacher=user)
            )
        elif user.role == "student":
            return Assessment.objects.filter(section__students=user)
        return Assessment.objects.none()


class AssessmentResultViewSet(viewsets.ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student__username", "assessment__name"]
    ordering_fields = ["marks_obtained", "student__username"]
    ordering = ["-assessment__date"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return [IsTeacherUser()]
        elif self.action == "destroy":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return AssessmentResult.objects.all()
        elif user.role == "school_admin":
            return AssessmentResult.objects.filter(
                assessment__section__school=user.school
            )
        elif user.role == "teacher":
            return AssessmentResult.objects.filter(
                Q(assessment__section__teacher=user)
                | Q(assessment__subject__teacher=user)
            )
        elif user.role == "student":
            return AssessmentResult.objects.filter(student=user)
        return AssessmentResult.objects.none()

    @action(detail=False, methods=["post"])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_bulk_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_bulk_create(self, serializer):
        serializer.save()


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "subject__name", "section__name"]
    ordering_fields = ["due_date", "title"]
    ordering = ["-due_date"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return [IsTeacherUser()]
        elif self.action == "destroy":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Assignment.objects.all()
        elif user.role == "school_admin":
            return Assignment.objects.filter(section__school=user.school)
        elif user.role == "teacher":
            return Assignment.objects.filter(
                Q(section__teacher=user) | Q(subject__teacher=user)
            )
        elif user.role == "student":
            return Assignment.objects.filter(section__students=user)
        return Assignment.objects.none()


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student__username", "assignment__title"]
    ordering_fields = ["submitted_at", "score"]
    ordering = ["-submitted_at"]

    def get_permissions(self):
        if self.action == "create":
            return [IsStudentUser()]
        elif self.action in ["update", "partial_update"]:
            return [IsTeacherUser()]
        elif self.action == "destroy":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return AssignmentSubmission.objects.all()
        elif user.role == "school_admin":
            return AssignmentSubmission.objects.filter(
                assignment__section__school=user.school
            )
        elif user.role == "teacher":
            return AssignmentSubmission.objects.filter(
                Q(assignment__section__teacher=user)
                | Q(assignment__subject__teacher=user)
            )
        elif user.role == "student":
            return AssignmentSubmission.objects.filter(student=user)
        return AssignmentSubmission.objects.none()


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["section__name", "subject__name"]
    ordering_fields = ["weekday", "start_time"]
    ordering = ["weekday", "start_time"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == "super_admin":
            return Timetable.objects.all()
        elif user.role == "school_admin":
            return Timetable.objects.filter(section__school=user.school)
        elif user.role == "teacher":
            return Timetable.objects.filter(
                Q(section__teacher=user) | Q(subject__teacher=user)
            )
        elif user.role == "student":
            return Timetable.objects.filter(section__students=user)
        return Timetable.objects.none()
