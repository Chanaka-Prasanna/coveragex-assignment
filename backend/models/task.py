from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from pydantic import ConfigDict

class TaskBase(BaseModel):
    """Base Task model with common attributes"""
    title: str = Field(..., min_length=3, description="Task title")
    description: str = Field(..., min_length=5, description="Task description")

class TaskCreate(TaskBase):
    """Model for creating a task"""
    pass

class TaskUpdate(BaseModel):
    """Model for updating a task"""
    title: Optional[str] = Field(None, min_length=3)
    description: Optional[str] = Field(None, min_length=5)
    is_completed: Optional[bool] = None

class TaskInDB(TaskBase):
    """Model for task as stored in database"""
    id: str
    is_completed: bool = False
    created_at: datetime
    updated_at: datetime

class TaskResponse(TaskBase):
    """Model for task response"""
    id: str
    is_completed: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config: ConfigDict = ConfigDict(from_attributes=True)
