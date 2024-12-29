from datetime import date
from typing import Optional
from pydantic import BaseModel
from app.models.student import Gender, BloodGroup
from app.schemas.base import BaseSchema

class StudentBase(BaseModel):
    admission_number: str
    roll_number: str
    class_name: str
    section: str
    date_of_birth: date
    gender: Gender
    blood_group: Optional[BloodGroup] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    parent_name: str
    parent_phone: str
    parent_email: str
    emergency_contact: Optional[str] = None
    medical_conditions: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    class_name: Optional[str] = None
    section: Optional[str] = None
    roll_number: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_conditions: Optional[str] = None

class StudentInDB(StudentBase, BaseSchema):
    user_id: int

class StudentResponse(StudentBase, BaseSchema):
    user_id: int
