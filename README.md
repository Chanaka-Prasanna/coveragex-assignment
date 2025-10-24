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

- Makesure that docker is being running in your machine (Open the docker)

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

## Testing with Docker

### Frontend Testing with Docker

1. **Open a new terminal in the project root** and run:

   ```bash
   docker compose exec frontend sh
   ```

2. **Inside the container, run the tests:**
   ```bash
   npm test
   ```

### Backend Testing with Docker

1. **Open a new terminal in the project root** and run:

   ```bash
   docker compose exec backend sh
   ```

2. **Run all test suites:**

   ```bash
   pytest tests
   ```

3. **Run individual test files:**
   ```bash
   python -m tests.test_integration
   python -m tests.test_task_model
   python -m tests.test_task_repository
   python -m tests.test_task_service
   ```

### Notes

- Make sure all services are running (`docker compose up`) before executing tests in containers.
- The Docker containers are configured with the necessary dependencies and environment variables for testing.

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
