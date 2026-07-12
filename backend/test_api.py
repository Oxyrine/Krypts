import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.user import User
from app.routers.auth import create_access_token
from datetime import timedelta

client = TestClient(app)

async def test():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == 'admin@example.com'))
        admin = result.scalar_one_or_none()
    
    token = create_access_token(
        data={"sub": str(admin.user_id)}, expires_delta=timedelta(minutes=30)
    )
    
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/groups", json={"name": "Api Test Group", "description": ""}, headers=headers)
    print("STATUS:", response.status_code)
    print("BODY:", response.json())

asyncio.run(test())
