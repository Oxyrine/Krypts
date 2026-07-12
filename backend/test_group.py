import asyncio
import uuid
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.groups import Group, GroupMember
from app.models.user import User

async def test():
    async with AsyncSessionLocal() as db:
        # get admin user
        result = await db.execute(select(User).where(User.email == 'admin@example.com'))
        admin = result.scalar_one_or_none()
        
        g = Group(
            group_id=uuid.uuid4(),
            owner_id=admin.user_id,
            name='Test',
            description=None
        )
        db.add(g)
        await db.commit()
        await db.refresh(g)
        print('Success adding group:', g.group_id)
        
        m = GroupMember(
            group_id=g.group_id,
            user_id=admin.user_id,
            role="admin"
        )
        db.add(m)
        await db.commit()
        print('Success adding member')

asyncio.run(test())
