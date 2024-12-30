from rest_framework import permissions
from apps.accounts.models import User


class IsSchoolAdmin(permissions.BasePermission):
    """
    Custom permission to only allow school admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'SCHOOL_ADMIN'

    def has_object_permission(self, request, view, obj):
        # Check if user is school admin and belongs to the same school
        return (request.user and request.user.is_authenticated and 
                request.user.role == 'SCHOOL_ADMIN' and 
                request.user.school == getattr(obj, 'school', None))


class IsSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow super admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_authenticated and request.user.is_superuser


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check if user is admin of the school
        return (request.user.role == 'SCHOOL_ADMIN' and 
                request.user.school == getattr(obj, 'school', None))
