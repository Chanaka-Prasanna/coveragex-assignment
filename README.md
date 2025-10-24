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

- Makesure you have installed docker in your machine

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

## Backend Setup (Manual)

1. **set these vaiable values in** `backend/.env`

```bash
DB_USER=cx
DB_PASSWORD=cxpass
DB_HOST=localhost
DB_PORT=3307
DB_NAME=coveragex
```

2. **Install dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
3. **Run the backend server:**
   ```sh
   uvicorn main:app --reload
   ```
4. **API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Frontend Setup (Manual)

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Run the frontend app:**
   ```sh
   npm run dev
   ```
3. **Open:** [http://localhost:3000](http://localhost:3000)

---

## Running Tests

### Backend

- **Unit & Integration Tests:**
  ```sh
  cd backend
  pytest
  ```

### Frontend

- **Unit Tests:**
  ```sh
  cd frontend
  npm test
  ```

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
