import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from config.settings import get_settings
from controllers.task_controller import router as task_router
from dependencies import get_db_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    db_service = get_db_service()
    try:
        await db_service.connect()
        yield
    finally:
        await db_service.disconnect()

# Create FastAPI application
app = FastAPI(lifespan=lifespan)

# Configure CORS
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Include routers
app.include_router(task_router)

@app.get("/")
async def read_root():
    """Root endpoint"""
    return "Hello from task manager back-end. See /docs for api info"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_service = get_db_service()
    db_status = "connected" if await db_service.health_check() else "disconnected"
    return {"status": "ok", "db": db_status}