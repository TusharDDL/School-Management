from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


class CRUDStudent(CRUDBase[Student, StudentCreate, StudentUpdate]):
    def get_by_admission_number(
        self, db: Session, *, admission_number: str
    ) -> Optional[Student]:
        return (
            db.query(Student)
            .filter(Student.admission_number == admission_number)
            .first()
        )

    def get_by_class_section(
        self, db: Session, *, class_name: str, section: str
    ) -> List[Student]:
        return (
            db.query(Student)
            .filter(Student.class_name == class_name, Student.section == section)
            .all()
        )

    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.user_id == user_id).first()


student = CRUDStudent(Student)
