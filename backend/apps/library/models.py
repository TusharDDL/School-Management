from django.db import models
from django.core.validators import MinValueValidator
from apps.accounts.models import User
from apps.core.models import School


class Book(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('issued', 'Issued'),
        ('lost', 'Lost'),
        ('damaged', 'Damaged'),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13, unique=True)
    publisher = models.CharField(max_length=200)
    publication_year = models.PositiveIntegerField()
    copies = models.PositiveIntegerField(default=1)
    available_copies = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='books')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

    def save(self, *args, **kwargs):
        if not self.pk:  # New book
            self.available_copies = self.copies
        super().save(*args, **kwargs)


class BookIssue(models.Model):
    STATUS_CHOICES = [
        ('issued', 'Issued'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
        ('lost', 'Lost'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='issues')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='book_issues')
    issue_date = models.DateField()
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='issued')
    fine_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.book.title} - {self.student.get_full_name()}"

    def save(self, *args, **kwargs):
        if self.status == 'returned' and not self.return_date:
            self.return_date = models.timezone.now().date()
        super().save(*args, **kwargs)

        # Update book status and available copies
        book = self.book
        if self.status == 'issued':
            book.available_copies = max(0, book.available_copies - 1)
            if book.available_copies == 0:
                book.status = 'issued'
        elif self.status == 'returned':
            book.available_copies = min(book.copies, book.available_copies + 1)
            if book.available_copies > 0:
                book.status = 'available'
        book.save()
