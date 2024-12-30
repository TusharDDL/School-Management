from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"academic-years", views.AcademicYearViewSet)
router.register(r"classes", views.ClassViewSet)
router.register(r"sections", views.SectionViewSet)
router.register(r"subjects", views.SubjectViewSet)
router.register(r"attendance", views.AttendanceViewSet)
router.register(r"assessments", views.AssessmentViewSet)
router.register(r"assessment-results", views.AssessmentResultViewSet)
router.register(r"assignments", views.AssignmentViewSet)
router.register(r"assignment-submissions", views.AssignmentSubmissionViewSet)
router.register(r"timetable", views.TimetableViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
