import unittest
from fastapi.testclient import TestClient
from main import app


class TestIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Use TestClient as context manager to trigger lifespan events
        cls.client_ctx = TestClient(app)

    def setUp(self):
        # Create a fresh task before each test that needs it
        self.created_task_ids = []
        with self.client_ctx as client:
            response = client.post("/tasks/", json={"title": "IntegrationTest", "description": "Integration Description"})
            if response.status_code == 200:
                task_id = response.json().get("id")
                self.created_task_id_at_start = task_id
                self.created_task_ids.append(task_id)
            else:
                self.created_task_id_at_start = None

    def tearDown(self):
        # Delete the task after each test
        self.created_task_id_at_start = None
        with self.client_ctx as client:
            for task_id in self.created_task_ids:
                client.delete(f"/tasks/{task_id}")

    def test_create_task(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={"title": "IntegrationTest", "description": "Integration Description"})
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["title"], "IntegrationTest")
            self.assertEqual(data["description"], "Integration Description")
            # Store the created task ID for later tests
            self.created_task_ids.append(data.get("id")) 

    def test_crete_task_missing_title(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={"description":"No Title"})
            self.assertEqual(response.status_code,422)  # Unprocessable Entity
    
    def test_crete_task_short_title(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={"title":"Te","description":"No Title"})
            self.assertEqual(response.status_code,422)  # Unprocessable Entity due to short title
    
    def test_crete_task_missing_description(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={"titile":"No Description"})
            self.assertEqual(response.status_code,422)  # Unprocessable Entity

    def test_crete_task_short_description(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={"titile":"Short Description","description":"Short"})
            self.assertEqual(response.status_code,422)  # Unprocessable Entity

    def test_crete_task_short_title_and_short_description(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={"titile":"No","description":"Short"})
            self.assertEqual(response.status_code,422)  # Unprocessable Entity

    def test_crete_task_empty_payload(self):
        with self.client_ctx as client:
            response = client.post("/tasks/",json={})
            self.assertEqual(response.status_code, 422)
    
    def test_create_task_with_whitespace_title(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={
                "title": "   ",
                "description": "Whitespace title"
            })
            self.assertEqual(response.status_code, 422)

    def test_create_task_with_whitespace_description(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={
                "title": "Valid Title",
                "description": "   "
            })
            self.assertEqual(response.status_code, 422)

    def test_crete_task_title_with_invalid_datatype(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={"title": 123, "description": "Valid Description"})
            self.assertEqual(response.status_code, 422)  # Should fail due to invalid datatype

    def test_crete_task_description_with_invalid_datatype(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={"title": "Valid Title", "description": 456})
            self.assertEqual(response.status_code, 422)  # Should fail due to invalid datatype

    def test_crete_task_with_extra_fields(self):
        with self.client_ctx as client:
            response = client.post("/tasks/", json={"title": "Valid Title", "description": "Valid Description", "extra_field": "extra_value"})
            self.assertEqual(response.status_code, 200)  # Extra fields should be ignored
            data = response.json()
            self.assertNotIn("extra_field", data)
            # Store the created task ID for cleanup
            created_id = data.get("id")
            if created_id:
                self.created_task_ids.append(created_id)
   
    def test_get_task_not_found(self):
        with self.client_ctx as client:
            response = client.get("/tasks/non-existent-id")
            self.assertEqual(response.status_code, 404)

    def test_get_task(self):
         with self.client_ctx as client:
            response = client.get(f"/tasks/{self.created_task_id_at_start}")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["id"], self.created_task_id_at_start)

    def test_get_tasks(self):
        with self.client_ctx as client:
            response = client.get("/tasks/")
            self.assertEqual(response.status_code, 200)
            self.assertIsInstance(response.json(), list)

    def test_get_tasks_after_deletion(self):
        with self.client_ctx as client:
            # Delete the created task
            client.delete(f"/tasks/{self.created_task_id_at_start}")
            # Get all tasks
            response = client.get("/tasks/")
            self.assertEqual(response.status_code, 200)
            tasks = response.json()
            ids = [task["id"] for task in tasks]
            self.assertNotIn(self.created_task_id_at_start, ids)

    def test_update_task_not_found(self):
        with self.client_ctx as client:
            response = client.put("/tasks/non-existent-id",json={"title": "Updated", "description": "Updated Description", "is_completed": True})
            self.assertEqual(response.status_code, 404)

    def test_update_task(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}",json={"title":"updated","description":"updated description","is_completed":True})
            self.assertEqual(response.status_code,200)
            data = response.json()
            self.assertEqual(data['title'],"updated")
            self.assertEqual(data['description'],"updated description")
            self.assertTrue(data['is_completed'],True)

    def test_update_task_empty_payload(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}",json={})
            self.assertEqual(response.status_code,400)  # Bad Request due to no fields to update
    
    def test_update_task_title_too_short(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"title": "ab"})
            self.assertEqual(response.status_code, 422)  # Should fail due to min length

    def test_update_task_description_too_short(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"description": "shrt"})
            self.assertEqual(response.status_code, 422)  # Should fail due to min length

    def test_update_task_title_and_description_too_short(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"title": "ab", "description": "shrt"})
            self.assertEqual(response.status_code, 422)  # Should fail due to min length

    def test_update_task_title_with_invalid_datatype(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"title": 123})
            self.assertEqual(response.status_code, 422)  # Should fail due to invalid datatype

    def test_update_task_description_with_invalid_datatype(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"description": 456})
            self.assertEqual(response.status_code, 422)  # Should fail due to invalid datatype
    
    def test_update_task_iscompleted_with_invalid_datatype(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={"is_completed": "stirng_instead_of_bool"})
            self.assertEqual(response.status_code, 422)  # Should fail due to invalid datatype

    def test_update_task_with_extra_fields(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={
                "title": "Updated Title",
                "description": "Updated Description",
                "extra_field": "should be ignored"
            })
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertNotIn("extra_field", data)

    def test_update_task_with_whitespace_title(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={
                "title": "   "
            })
            self.assertEqual(response.status_code, 422)

    def test_update_task_with_whitespace_description(self):
        with self.client_ctx as client:
            response = client.put(f"/tasks/{self.created_task_id_at_start}", json={
                "description": "   "
            })
            self.assertEqual(response.status_code, 422)

    def test_delete_task_not_found(self):
        with self.client_ctx as client:
            response = client.delete("/tasks/non-existent-id")
            self.assertEqual(response.status_code, 404)
    
    def test_delete_task(self):
        with self.client_ctx as client:
            response = client.delete(f"/tasks/{self.created_task_id_at_start}")
            self.assertEqual(response.status_code, 200)
            # Verify deletion
            get_response = client.get(f"/tasks/{self.created_task_id_at_start}")
            self.assertEqual(get_response.status_code, 404)




if __name__ == "__main__":
    unittest.main()
