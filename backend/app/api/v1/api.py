from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, library

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(library.router, prefix="/library", tags=["Library"])
