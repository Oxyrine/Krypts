import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

from app.models.file_share import FileShare
from app.models.protected_file import ProtectedFile
from app.models.user import User

async def run():
    engine = create_async_engine("sqlite+aiosqlite:///./krypts_drm.db")
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        stmt = (
            select(FileShare, ProtectedFile, User)
            .join(ProtectedFile, FileShare.file_id == ProtectedFile.file_id)
            .join(User, FileShare.shared_by_id == User.user_id)
            .where(FileShare.target_group_id != None)
        )
        try:
            result = await db.execute(stmt)
            rows = result.all()
            print("Success!", rows)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run())
