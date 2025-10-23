import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from databases import Database
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Read DB config from environment variables
DB_USER = os.getenv("DB_USER", "cx")
DB_PASSWORD = os.getenv("DB_PASSWORD", "cxpass")
DB_HOST = os.getenv("DB_HOST", "localhost")  # Use 'db' for Docker, 'localhost' for local
DB_PORT = os.getenv("DB_PORT", "3307")
DB_NAME = os.getenv("DB_NAME", "coveragex")

# DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
DATABASE_URL = f"mysql+aiomysql://cx:cxpass@localhost:3307/coveragex"

database = Database(DATABASE_URL, min_size=1, max_size=5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("Connecting to database at %s", DATABASE_URL)
        await database.connect()
        create_table_query = """
            CREATE TABLE IF NOT EXISTS tasks (
            id CHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        """
        await database.execute(create_table_query)
        logger.info("Database connected")
    except Exception as e:
        logger.exception("Failed to connect to database: %s", e)
        # If you prefer to fail startup, re-raise the exception
        raise

    yield

    try:
        await database.disconnect()
        logger.info("Database disconnected")
    except Exception as e:
        logger.exception("Error during database disconnect: %s", e)


app = FastAPI(lifespan=lifespan)

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

class TaskIn(BaseModel):
    title: str
    description: str

class TaskOut(TaskIn):
    id: str
    is_completed: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

@app.post("/tasks/", response_model=TaskOut)
async def create_task(task: TaskOut):
    # Generate a new UUID if not provided
    query = """
        INSERT INTO tasks (id, title, description, is_completed)
        VALUES (:id, :title, :description, :is_completed)
    """
    print(type(task))
    values = {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "is_completed": task.is_completed
    }
 
    try:
        await database.execute(query, values=values)
        return {**task.dict()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error inserting task: {str(e)}")

@app.get("/tasks/", response_model=list[TaskOut])
async def get_tasks():
    try:
        query = "SELECT * FROM tasks ORDER BY created_at DESC"
        tasks = await database.fetch_all(query)
        return [serialize_task(dict(task)) for task in tasks]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")


@app.get("/tasks/{task_id}", response_model=TaskOut)
async def get_task(task_id: str):  # should be str since id is CHAR(36)
    try:
        query = "SELECT * FROM tasks WHERE id = :id"
        task = await database.fetch_one(query, values={"id": task_id})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return serialize_task(dict(task))
    except HTTPException:
        raise  # re-raise for FastAPI to handle cleanly
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving task: {str(e)}")

@app.put("/tasks/{task_id}", response_model=TaskOut)
async def update_task(task_id: str, task: TaskUpdate):
    try:
        fields = {k: v for k, v in task.dict().items() if v is not None}
        if not fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{k} = :{k}" for k in fields])
        query = f"UPDATE tasks SET {set_clause} WHERE id = :id"
        values = {**fields, "id": task_id}

        result = await database.execute(query, values=values)
        if not result:
            raise HTTPException(status_code=404, detail="Task not found")

        updated_task = await database.fetch_one("SELECT * FROM tasks WHERE id = :id", values={"id": task_id})
        return serialize_task(dict(updated_task))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")

@app.delete("/tasks/{task_id}", response_model=dict)
async def delete_task(task_id: str):
    try:
        query = "DELETE FROM tasks WHERE id = :id"
        result = await database.execute(query, values={"id": task_id})
        # result is the number of affected rows for aiomysql
        if result == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"status": "ok"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")

@app.get('/')
async def read_root():
    return "Hello from task manager back-end. See /docs for api info"

@app.get("/health")
async def health_check():
    """
    Returns simple status and whether DB responds to a simple SELECT.
    """
    db_status = "unknown"
    try:
        # Use fetch_val to get the scalar result of SELECT 1
        val = await database.fetch_val("SELECT 1")
        if val in (1, "1"):
            db_status = "connected"
        else:
            db_status = f"unexpected response: {val}"
    except Exception as e:
        db_status = f"error: {str(e)}"
        logger.exception("Health check DB error: %s", e)

    return {"status": "ok", "db": db_status}


def serialize_task(task):
    # Converts datetime fields to ISO strings
    return {
        **task,
        "created_at": task["created_at"].isoformat() if task["created_at"] else None,
        "updated_at": task["updated_at"].isoformat() if task["updated_at"] else None,
    }