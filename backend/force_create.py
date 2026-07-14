import asyncio
from app.database import engine, Base
import app.models.user
import app.models.activity_log
import app.models.security_alert
import app.models.protected_file
import app.models.api_key
import app.models.groups
import app.models.file_share

async def force_create():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(force_create())
