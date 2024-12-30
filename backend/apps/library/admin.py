from django.contrib import admin
from .models import Book, BookIssue


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'status', 'copies', 'available_copies')
    search_fields = ('title', 'author', 'isbn')
    list_filter = ('status', 'publication_year')


@admin.register(BookIssue)
class BookIssueAdmin(admin.ModelAdmin):
    list_display = ('book', 'student', 'issue_date', 'due_date', 'status')
    search_fields = ('book__title', 'student__email')
    list_filter = ('status', 'issue_date', 'due_date')
