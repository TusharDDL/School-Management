from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
from app.schemas.base import BaseSchema


class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase, BaseSchema):
    is_active: bool
    is_verified: bool


class UserResponse(UserBase, BaseSchema):
    is_active: bool
    is_verified: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
