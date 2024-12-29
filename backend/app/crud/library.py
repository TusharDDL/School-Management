from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.crud.base import CRUDBase
from app.models.library import Book, LibraryMember, BookCirculation, BookCategory
from app.schemas.library import (
    BookCreate,
    BookUpdate,
    LibraryMemberCreate,
    LibraryMemberUpdate,
    BookCirculationCreate,
    BookCirculationUpdate,
    BookCategoryCreate,
    BookCategoryUpdate,
)

class CRUDBook(CRUDBase[Book, BookCreate, BookUpdate]):
    def get_by_isbn(self, db: Session, *, isbn: str) -> Optional[Book]:
        return db.query(Book).filter(Book.isbn == isbn).first()

    def get_by_category(self, db: Session, *, category: str) -> List[Book]:
        return db.query(Book).filter(Book.category == category).all()

    def search(
        self,
        db: Session,
        *,
        query: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Book]:
        return (
            db.query(Book)
            .filter(
                or_(
                    Book.title.ilike(f"%{query}%"),
                    Book.author.ilike(f"%{query}%"),
                    Book.isbn.ilike(f"%{query}%"),
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

class CRUDLibraryMember(CRUDBase[LibraryMember, LibraryMemberCreate, LibraryMemberUpdate]):
    def get_by_card_number(
        self, db: Session, *, card_number: str
    ) -> Optional[LibraryMember]:
        return db.query(LibraryMember).filter(LibraryMember.card_number == card_number).first()

    def get_by_user_id(
        self, db: Session, *, user_id: int
    ) -> Optional[LibraryMember]:
        return db.query(LibraryMember).filter(LibraryMember.user_id == user_id).first()

    def get_active_members(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[LibraryMember]:
        return (
            db.query(LibraryMember)
            .filter(LibraryMember.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

class CRUDBookCirculation(CRUDBase[BookCirculation, BookCirculationCreate, BookCirculationUpdate]):
    def get_active_by_member(
        self, db: Session, *, member_id: int
    ) -> List[BookCirculation]:
        return (
            db.query(BookCirculation)
            .filter(
                and_(
                    BookCirculation.member_id == member_id,
                    BookCirculation.return_date.is_(None)
                )
            )
            .all()
        )

    def get_overdue(
        self, db: Session, *, current_date: date
    ) -> List[BookCirculation]:
        return (
            db.query(BookCirculation)
            .filter(
                and_(
                    BookCirculation.return_date.is_(None),
                    BookCirculation.due_date < current_date
                )
            )
            .all()
        )

class CRUDBookCategory(CRUDBase[BookCategory, BookCategoryCreate, BookCategoryUpdate]):
    def get_by_name(
        self, db: Session, *, name: str
    ) -> Optional[BookCategory]:
        return db.query(BookCategory).filter(BookCategory.name == name).first()

    def get_root_categories(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[BookCategory]:
        return (
            db.query(BookCategory)
            .filter(BookCategory.parent_id.is_(None))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_subcategories(
        self, db: Session, *, parent_id: int
    ) -> List[BookCategory]:
        return (
            db.query(BookCategory)
            .filter(BookCategory.parent_id == parent_id)
            .all()
        )

book = CRUDBook(Book)
library_member = CRUDLibraryMember(LibraryMember)
book_circulation = CRUDBookCirculation(BookCirculation)
book_category = CRUDBookCategory(BookCategory)
