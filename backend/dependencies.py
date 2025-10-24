from functools import lru_cache
from config.settings import get_settings
from services.database import DatabaseService
from repositories.task_repository import TaskRepository
from services.task_service import TaskService

@lru_cache()
def get_db_service() -> DatabaseService:
    """Get database service instance"""
    settings = get_settings()
    return DatabaseService(settings.database_url)

@lru_cache()
def get_task_repository() -> TaskRepository:
    """Get task repository instance"""
    return TaskRepository(get_db_service())

@lru_cache()
def get_task_service() -> TaskService:
    """Get task service instance"""
    return TaskService(get_task_repository())
