from sqlalchemy import (
    Column,
    String,
    Integer,
    Date,
    ForeignKey,
    Enum,
    Float,
    Boolean,
    Text,
)
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum


class BookStatus(str, enum.Enum):
    AVAILABLE = "available"
    ISSUED = "issued"
    LOST = "lost"
    DAMAGED = "damaged"
    UNDER_REPAIR = "under_repair"


class CirculationStatus(str, enum.Enum):
    ISSUED = "issued"
    RETURNED = "returned"
    OVERDUE = "overdue"
    LOST = "lost"


class Book(BaseModel):
    __tablename__ = "books"

    title = Column(String, index=True)
    isbn = Column(String, unique=True, index=True)
    author = Column(String)
    publisher = Column(String)
    category = Column(String)
    edition = Column(String)
    publication_year = Column(Integer)
    copies = Column(Integer)
    available_copies = Column(Integer)
    price = Column(Float)
    location = Column(String)
    description = Column(Text)
    cover_image = Column(String)
    status = Column(Enum(BookStatus), default=BookStatus.AVAILABLE)


class LibraryMember(BaseModel):
    __tablename__ = "library_members"

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    membership_type = Column(String)
    card_number = Column(String, unique=True, index=True)
    start_date = Column(Date)
    end_date = Column(Date)
    max_books = Column(Integer)
    is_active = Column(Boolean, default=True)

    user = relationship("User", backref="library_member")


class BookCirculation(BaseModel):
    __tablename__ = "book_circulations"

    book_id = Column(Integer, ForeignKey("books.id"))
    member_id = Column(Integer, ForeignKey("library_members.id"))
    issue_date = Column(Date)
    due_date = Column(Date)
    return_date = Column(Date)
    fine_amount = Column(Float, default=0)
    status = Column(Enum(CirculationStatus), default=CirculationStatus.ISSUED)
    remarks = Column(String)

    book = relationship("Book", backref="circulations")
    member = relationship("LibraryMember", backref="circulations")


class BookCategory(BaseModel):
    __tablename__ = "book_categories"

    name = Column(String, unique=True, index=True)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("book_categories.id"))

    parent = relationship("BookCategory", remote_side=[id], backref="subcategories")
