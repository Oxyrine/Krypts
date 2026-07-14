import asyncio
import httpx
import uuid

async def test_group_files_with_data():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Create a user to test with
        res = await client.post("/auth/signup", json={"email": "testfiles12@test.com", "password": "password", "full_name": "Test Files"})
        
        # Login
        res = await client.post("/auth/login", json={"email": "testfiles12@test.com", "password": "password"})
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
        
        # Upload a file
        with open("test.txt", "w") as f:
            f.write("hello")
        files = {"file": open("test.txt", "rb")}
        res = await client.post("/upload", files=files, headers=headers)
        if res.status_code not in [200, 201]:
            print("File upload failed:", res.status_code, res.text)
            return
            
        file_id = res.json()["id"]
        
        # Share file with group
        res = await client.post("/inbox/share", json={"file_id": file_id, "target_group_id": group_id}, headers=headers)
        if res.status_code != 200:
            print("File share failed:", res.text)
            return
            
        # Get files for group
        res = await client.get(f"/groups/{group_id}/files", headers=headers)
        print("Get files response status:", res.status_code)
        print("Get files response body:", res.text)

if __name__ == "__main__":
    asyncio.run(test_group_files_with_data())
