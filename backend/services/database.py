from typing import Any, Dict, List, Optional, TypeVar, Generic
from databases import Database
from fastapi import HTTPException
import logging

T = TypeVar('T')

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.database = Database(database_url, min_size=1, max_size=5)

    async def connect(self) -> None:
        """Connect to the database"""
        try:
            await self.database.connect()
            # Create tables
            await self._create_tables()
            logger.info("Connected to database")
        except Exception as e:
            logger.exception("Failed to connect to database: %s", e)
            raise

    async def disconnect(self) -> None:
        """Disconnect from the database"""
        try:
            await self.database.disconnect()
            logger.info("Disconnected from database")
        except Exception as e:
            logger.exception("Error during database disconnect: %s", e)
            raise

    async def _create_tables(self) -> None:
        """Create necessary database tables"""
        create_tasks_table = """
            CREATE TABLE IF NOT EXISTS tasks (
                id CHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        """
        await self.database.execute(create_tasks_table)

    async def fetch_one(self, query: str, values: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        """Fetch a single record"""
        try:
            result = await self.database.fetch_one(query, values)
            return dict(result) if result else None
        except Exception as e:
            logger.exception("Error in fetch_one: %s", e)
            raise HTTPException(status_code=500, detail=str(e))

    async def fetch_all(self, query: str, values: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Fetch all records"""
        try:
            results = await self.database.fetch_all(query, values)
            return [dict(row) for row in results]
        except Exception as e:
            logger.exception("Error in fetch_all: %s", e)
            raise HTTPException(status_code=500, detail=str(e))

    async def execute(self, query: str, values: Optional[Dict] = None) -> Any:
        """Execute a query"""
        try:
            return await self.database.execute(query, values)
        except Exception as e:
            logger.exception("Error in execute: %s", e)
            raise HTTPException(status_code=500, detail=str(e))

    async def health_check(self) -> bool:
        """Check database health"""
        try:
            val = await self.database.fetch_val("SELECT 1")
            return val in (1, "1")
        except Exception as e:
            logger.exception("Health check failed: %s", e)
            return False
