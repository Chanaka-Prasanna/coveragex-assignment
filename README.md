# CoverageX To-Do Task Web Application

A full-stack to-do task management app built for the CoverageX assessment. Users can create, view, and complete tasks. The app features a RESTful backend, a modern frontend SPA, and is fully containerized with Docker.

## Features

- Create tasks with title and description
- View the 5 most recent tasks
- Mark tasks as completed (completed tasks are hidden)
- Backend REST API (FastAPI, Python)
- Frontend SPA (Next.js, React, TypeScript)
- Relational database (MySQL)
- Unit and integration tests for backend and frontend
- Dockerized for easy setup

---

## Prerequisites

- Makesure that docker is being running in your machine (Open the docker app)

---

## Quick Start (All Services)

1. **Clone the repository:**

   Repo url - https://github.com/Chanaka-Prasanna/coveragex-assignment

   ```sh
   git clone https://github.com/Chanaka-Prasanna/coveragex-assignment.git
   cd coveragex-assignment
   ```

2. **Start all services (frontend, backend, database):**

   ```sh
   docker-compose up --build
   ```

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## Backend Test Guidance

### Running All Tests

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Set the `PYTHONPATH` to the backend root:
   - **PowerShell:**
     ```powershell
     $env:PYTHONPATH="."
     ```
   - **Command Prompt (cmd):**
     ```cmd
     set PYTHONPATH=.
     ```
3. Run all tests:
   ```powershell
   pytest tests
   ```

### Running Individual Test Files

You can run a specific test file using:

```powershell
python -m tests.test_integration
python -m tests.test_task_model
python -m tests.test_task_repository
python -m tests.test_task_service
```

### Notes

- Make sure your environment variables and dependencies are set up before running tests.
- For code coverage, use:
  ```powershell
  pytest --cov
  ```

---

## Frontend Test Guidance

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```powershell
   npm install
   ```
3. Run all frontend tests:
   ```powershell
   npm test
   ```

### Notes

- Make sure your dependencies are installed before running tests.
- For more advanced test options, see the frontend's test documentation or package.json scripts.

---

## Project Structure

```
coveragex-assignment/
├── backend/      # FastAPI backend & tests
├── frontend/     # Next.js frontend & tests
├── docker-compose.yml
└── README.md
```

---

## Notes

- All services are containerized; no manual DB setup required.
- For any issues, check container logs or reach out to the repository owner.

---

## License

MIT
