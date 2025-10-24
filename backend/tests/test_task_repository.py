
import unittest
from unittest.mock import AsyncMock
from repositories.task_repository import TaskRepository
from services.database import DatabaseService
from models.task import TaskCreate

class TestTaskRepository(unittest.IsolatedAsyncioTestCase):
    async def test_create_and_get_by_id(self):
        db = AsyncMock(spec=DatabaseService)
        db.execute.return_value = None
        db.fetch_one.return_value = {"id": "1", "title": "Test", "description": "Description", "is_completed": False, "created_at": None, "updated_at": None}
        repo = TaskRepository(db)
        task = TaskCreate(title="Test", description="Description")
        result = await repo.create(task, "1")
        self.assertEqual(result["id"], "1")

    async def test_get_all(self):
        db = AsyncMock(spec=DatabaseService)
        db.fetch_all.return_value = []
        repo = TaskRepository(db)
        result = await repo.get_all()
        self.assertIsInstance(result, list)

if __name__ == "__main__":
    unittest.main()
