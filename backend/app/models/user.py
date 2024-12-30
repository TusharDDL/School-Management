from sqlalchemy import Column, String, Boolean, Enum
from app.models.base import BaseModel
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"
    LIBRARIAN = "librarian"
    ACCOUNTANT = "accountant"


class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(Enum(UserRole))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
