from typing import List
from uuid import uuid4
from models.task import TaskCreate, TaskUpdate, TaskResponse, TaskInDB
from repositories.task_repository import TaskRepository

class TaskService:
    def __init__(self, task_repository: TaskRepository):
        self.repository = task_repository

    def _to_response(self, task: TaskInDB) -> TaskResponse:
        """Convert TaskInDB to TaskResponse"""
        return TaskResponse(
            id=task["id"],
            title=task["title"],
            description=task["description"],
            is_completed=task["is_completed"],
            created_at=task["created_at"].isoformat() if task["created_at"] else None,
            updated_at=task["updated_at"].isoformat() if task["updated_at"] else None
        )

    async def create_task(self, task: TaskCreate) -> TaskResponse:
        """Create a new task"""
        task_id = str(uuid4())
        db_task = await self.repository.create(task, task_id)
        return self._to_response(db_task)

    async def get_tasks(self) -> List[TaskResponse]:
        """Get all tasks"""
        tasks = await self.repository.get_all()
        return [self._to_response(task) for task in tasks]

    async def get_task(self, task_id: str) -> TaskResponse:
        """Get a task by ID"""
        task = await self.repository.get_by_id(task_id)
        return self._to_response(task)

    async def update_task(self, task_id: str, task: TaskUpdate) -> TaskResponse:
        """Update a task"""
        updated_task = await self.repository.update(task_id, task)
        return self._to_response(updated_task)

    async def delete_task(self, task_id: str) -> bool:
        """Delete a task"""
        return await self.repository.delete(task_id)
