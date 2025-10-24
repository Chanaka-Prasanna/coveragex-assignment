
import unittest
from backend.models.task import TaskCreate, TaskUpdate, TaskInDB, TaskResponse
from datetime import datetime

class TestTaskModel(unittest.TestCase):
    def test_task_create(self):
        task = TaskCreate(title="Test", description="Description")
        self.assertEqual(task.title, "Test")
        self.assertEqual(task.description, "Description")

    def test_task_update(self):
        task = TaskUpdate(title="Updated", description="Updated Description", is_completed=True)
        self.assertEqual(task.title, "Updated")
        self.assertEqual(task.description, "Updated Description")
        self.assertTrue(task.is_completed)

    def test_task_in_db(self):
        now = datetime.now()
        task = TaskInDB(id="1", title="Test", description="Description", is_completed=True, created_at=now, updated_at=now)
        self.assertEqual(task.id, "1")
        self.assertEqual(task.description, "Description")
        self.assertTrue(task.is_completed)

    def test_task_response(self):
        task = TaskResponse(id="1", title="Test", description="Description", is_completed=True)
        self.assertEqual(task.id, "1")
        self.assertEqual(task.description, "Description")
        self.assertTrue(task.is_completed)

if __name__ == "__main__":
    unittest.main()
