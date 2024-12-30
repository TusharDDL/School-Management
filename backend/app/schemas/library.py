from datetime import date
from typing import Optional, List
from pydantic import BaseModel
from app.models.library import BookStatus, CirculationStatus
from app.schemas.base import BaseSchema


class BookBase(BaseModel):
    title: str
    isbn: str
    author: str
    publisher: str
    category: str
    edition: Optional[str] = None
    publication_year: int
    copies: int
    available_copies: int
    price: float
    location: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    status: BookStatus = BookStatus.AVAILABLE


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    category: Optional[str] = None
    edition: Optional[str] = None
    copies: Optional[int] = None
    available_copies: Optional[int] = None
    price: Optional[float] = None
    location: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[BookStatus] = None


class BookInDB(BookBase, BaseSchema):
    pass


class BookResponse(BookBase, BaseSchema):
    pass


class LibraryMemberBase(BaseModel):
    user_id: int
    membership_type: str
    card_number: str
    start_date: date
    end_date: date
    max_books: int
    is_active: bool = True


class LibraryMemberCreate(LibraryMemberBase):
    pass


class LibraryMemberUpdate(BaseModel):
    membership_type: Optional[str] = None
    end_date: Optional[date] = None
    max_books: Optional[int] = None
    is_active: Optional[bool] = None


class LibraryMemberInDB(LibraryMemberBase, BaseSchema):
    pass


class LibraryMemberResponse(LibraryMemberBase, BaseSchema):
    pass


class BookCirculationBase(BaseModel):
    book_id: int
    member_id: int
    issue_date: date
    due_date: date
    return_date: Optional[date] = None
    fine_amount: float = 0
    status: CirculationStatus = CirculationStatus.ISSUED
    remarks: Optional[str] = None


class BookCirculationCreate(BookCirculationBase):
    pass


class BookCirculationUpdate(BaseModel):
    return_date: Optional[date] = None
    fine_amount: Optional[float] = None
    status: Optional[CirculationStatus] = None
    remarks: Optional[str] = None


class BookCirculationInDB(BookCirculationBase, BaseSchema):
    pass


class BookCirculationResponse(BookCirculationBase, BaseSchema):
    book: BookResponse
    member: LibraryMemberResponse


class BookCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None


class BookCategoryCreate(BookCategoryBase):
    pass


class BookCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None


class BookCategoryInDB(BookCategoryBase, BaseSchema):
    pass


class BookCategoryResponse(BookCategoryBase, BaseSchema):
    subcategories: List["BookCategoryResponse"] = []


BookCategoryResponse.model_rebuild()
