from sqlalchemy import Column, String, Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class BloodGroup(str, enum.Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"


class Student(BaseModel):
    __tablename__ = "students"

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    admission_number = Column(String, unique=True, index=True)
    roll_number = Column(String)
    class_name = Column(String)
    section = Column(String)
    date_of_birth = Column(Date)
    gender = Column(Enum(Gender))
    blood_group = Column(Enum(BloodGroup))
    address = Column(String)
    phone = Column(String)
    parent_name = Column(String)
    parent_phone = Column(String)
    parent_email = Column(String)
    emergency_contact = Column(String)
    medical_conditions = Column(String)

    user = relationship("User", backref="student")
