import asyncio
import json
import httpx

async def test():
    # Attempt to login using the test user
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # We need a user. Let's create one or login as admin.
        # The admin password is not known, but we can query the DB and force login? No.
        # Let's hit signup to create a new user.
        res = await client.post("/auth/signup", json={"email": "tester99@example.com", "password": "password123", "full_name": "Tester"})
        if res.status_code == 400:
            res = await client.post("/auth/login", json={"email": "tester99@example.com", "password": "password123"})
        
        if res.status_code != 200 and res.status_code != 201:
            print("Auth failed", res.status_code, res.text)
            return

        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Now try to create a group
        print("Creating group...")
        res = await client.post("/groups", json={"name": "Frontend Test", "description": ""}, headers=headers)
        print("Create Group:", res.status_code, res.text)

        if res.status_code == 200:
            print("Fetching groups...")
            res = await client.get("/groups", headers=headers)
            print("Fetch Groups:", res.status_code, res.text)

asyncio.run(test())
