import asyncio
import httpx

async def test_group_files():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Create a user to test with
        res = await client.post("/auth/signup", json={"email": "testfiles9@test.com", "password": "password", "full_name": "Test Files"})
        
        # Login
        res = await client.post("/auth/login", json={"email": "testfiles9@test.com", "password": "password"})
        if res.status_code != 200:
            print("Login failed:", res.text)
            return
        
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a group
        res = await client.post("/groups", json={"name": "File Test Group"}, headers=headers)
        if res.status_code != 200:
            print("Group create failed:", res.text)
            return
        
        group_id = res.json()["group_id"]
        
        # Get files for group
        res = await client.get(f"/groups/{group_id}/files", headers=headers)
        print("Get files response status:", res.status_code)
        print("Get files response body:", res.text)

if __name__ == "__main__":
    asyncio.run(test_group_files())
