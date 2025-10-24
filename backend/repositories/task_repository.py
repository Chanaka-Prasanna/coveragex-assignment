from typing import List, Optional
from fastapi import HTTPException
from models.task import TaskCreate, TaskUpdate, TaskInDB
from services.database import DatabaseService

class TaskRepository:
    def __init__(self, db: DatabaseService):
        self.db = db

    async def create(self, task: TaskCreate, task_id: str) -> TaskInDB:
        """Create a new task"""
        query = """
            INSERT INTO tasks (id, title, description, is_completed)
            VALUES (:id, :title, :description, :is_completed)
        """
        values = {
            "id": task_id,
            "title": task.title,
            "description": task.description,
            "is_completed": False
        }

        try:
            await self.db.execute(query, values)
            return await self.get_by_id(task_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating task: {str(e)}")

    async def get_all(self) -> List[TaskInDB]:
        """Get all tasks"""
        query = "SELECT * FROM tasks ORDER BY created_at DESC"
        return await self.db.fetch_all(query)

    async def get_by_id(self, task_id: str) -> Optional[TaskInDB]:
        """Get a task by ID"""
        query = "SELECT * FROM tasks WHERE id = :id"
        task = await self.db.fetch_one(query, {"id": task_id})
        
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    async def update(self, task_id: str, task: TaskUpdate) -> TaskInDB:
        """Update a task"""
        fields = {k: v for k, v in task.dict().items() if v is not None}
        if not fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{k} = :{k}" for k in fields])
        query = f"UPDATE tasks SET {set_clause} WHERE id = :id"
        values = {**fields, "id": task_id}

        result = await self.db.execute(query, values)
        if not result:
            raise HTTPException(status_code=404, detail="Task not found")

        return await self.get_by_id(task_id)

    async def delete(self, task_id: str) -> bool:
        """Delete a task"""
        query = "DELETE FROM tasks WHERE id = :id"
        result = await self.db.execute(query, {"id": task_id})
        
        if result == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return True
