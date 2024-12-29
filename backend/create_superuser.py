import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.auth import get_password_hash
from app.models.user import User, UserRole


async def create_superuser():
    db = SessionLocal()
    try:
        # Check if superuser already exists
        if db.query(User).filter(User.username == "admin").first():
            print("Superuser already exists")
            return

        # Create superuser
        superuser = User(
            username="admin",
            email="admin@school.com",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(superuser)
        db.commit()
        db.refresh(superuser)
        print("Superuser created successfully")
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(create_superuser())
