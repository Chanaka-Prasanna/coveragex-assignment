from fastapi import APIRouter, Depends
from typing import List
from models.task import TaskCreate, TaskUpdate, TaskResponse
from services.task_service import TaskService
from dependencies import get_task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    task_service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """Create a new task"""
    return await task_service.create_task(task)

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    task_service: TaskService = Depends(get_task_service)
) -> List[TaskResponse]:
    """Get all tasks"""
    return await task_service.get_tasks()

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    task_service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """Get a task by ID"""
    return await task_service.get_task(task_id)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task: TaskUpdate,
    task_service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """Update a task"""
    return await task_service.update_task(task_id, task)

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    task_service: TaskService = Depends(get_task_service)
) -> dict:
    """Delete a task"""
    await task_service.delete_task(task_id)
    return {"status": "ok"}
