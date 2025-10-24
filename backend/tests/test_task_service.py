
import unittest
from unittest.mock import AsyncMock
from services.task_service import TaskService
from repositories.task_repository import TaskRepository
from models.task import TaskCreate, TaskUpdate

class TestTaskService(unittest.IsolatedAsyncioTestCase):
    async def test_create_task(self):
        repo = AsyncMock(spec=TaskRepository)
        repo.create.return_value = {"id": "1", "title": "Test", "description": "Description", "is_completed": False, "created_at": None, "updated_at": None}
        service = TaskService(repo)
        task = TaskCreate(title="Test", description="Description")
        result = await service.create_task(task)
        self.assertEqual(result.id, "1")

    async def test_get_tasks(self):
        repo = AsyncMock(spec=TaskRepository)
        repo.get_all.return_value = [{"id": "1", "title": "Test", "description": "Description", "is_completed": False, "created_at": None, "updated_at": None}]
        service = TaskService(repo)
        result = await service.get_tasks()
        self.assertIsInstance(result, list)
        self.assertEqual(result[0].id, "1")

    async def test_update_task(self):
        repo = AsyncMock(spec=TaskRepository)
        repo.update.return_value = {"id": "1", "title": "Updated", "description": "Updated Description", "is_completed": True, "created_at": None, "updated_at": None}
        service = TaskService(repo)
        task = TaskUpdate(title="Updated", is_completed=True)
        result = await service.update_task("1", task)
        self.assertEqual(result.title, "Updated")
        self.assertTrue(result.is_completed)

if __name__ == "__main__":
    unittest.main()
