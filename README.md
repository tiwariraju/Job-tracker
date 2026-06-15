## 🚀 Live Demo

Frontend: [https://job-tracker-two-iota.vercel.app](https://job-tracker-two-iota.vercel.app)

Backend API: [https://job-tracker-backend-geie.onrender.com](https://job-tracker-backend-geie.onrender.com)

# Job Tracker

Personal project to keep track of job applications — company name, role, status, and applied date.  
I built this as a full-stack app: Spring Boot handles the API and database, React handles the UI.

---

## Why I built this

While applying for jobs I was maintaining everything in notes/spreadsheet. That worked for a while but searching and updating status was messy. So I made a small web app where I can add applications, change status (Applied → Interview → Rejected), search by company or role, and see a quick count at the top.

The backend is designed to handle a large list comfortably (100+ entries) with proper DB indexes and server-side search instead of loading everything in the browser.

---

## Tech stack — what I used and why

| Technology | Where | Why I picked it |
|------------|-------|-----------------|
| **Java 17** | Backend | Stable LTS version, works well with Spring Boot 3 |
| **Spring Boot 3** | Backend | Fast setup for REST APIs, dependency injection, auto-config |
| **Spring Data JPA + Hibernate** | Backend | ORM layer — no manual JDBC; entities map directly to MySQL tables |
| **MySQL** | Database | Relational data fits well (jobs with status, dates); easy to run locally |
| **Bean Validation** | Backend | `@NotBlank`, `@NotNull` on DTOs — bad requests caught before service layer |
| **React + Vite** | Frontend | React for UI state; Vite for quick dev server and fast builds |
| **Axios** | Frontend | Simple HTTP calls from React to Spring Boot REST endpoints |
| **Postman** | Testing | Manual API testing — all endpoints documented in `postman_collection.json` |

---

## Project structure

```
Job_Tracker/
├── backend/                  # Spring Boot API (runs on port 8080)
├── frontend/                 # React app (runs on port 5173)
├── postman_collection.json   # Postman requests for all APIs
└── README.md
```

---

## How I structured the backend

I followed a simple layered flow — nothing fancy, just clean separation:

```
Controller  →  Service  →  Repository  →  MySQL
```

- **Controller** (`JobController`) — REST endpoints, takes request, returns JSON
- **Service** (`JobServiceImpl`) — business logic (create, update, search, stats)
- **Repository** (`JobRepository`) — JPA queries to MySQL
- **DTOs** (`JobRequest`, `JobResponse`, etc.) — separate API payload from DB entity
- **Mapper** (`JobMapper`) — converts between DTO and `Job` entity
- **GlobalExceptionHandler** — one place for 404, validation errors, bad JSON

For errors I used `@ControllerAdvice` so every API returns the same JSON error format instead of a random stack trace.

For validation, POST/PUT/PATCH bodies go through `@Valid` + Bean Validation. If company name is empty, API returns 400 with field-wise messages.

---

## Database design

**Table:** `jobs`

| Column | Type | Notes |
|--------|------|-------|
| id | Long | Auto-generated primary key |
| company_name | String | Required |
| role | String | Required |
| status | Enum | APPLIED, INTERVIEW, REJECTED |
| applied_date | LocalDate | Required |

I added indexes on `status`, `company_name`, and `applied_date` so filtering and search stay fast when the list grows.

Hibernate creates/updates the schema automatically in dev (`ddl-auto=update`). For a real deployment I'd switch to Flyway or Liquibase migrations.

---

## API endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | `/jobs` | Add new application |
| GET | `/jobs` | Get all applications |
| GET | `/jobs/{id}` | Get one by ID |
| PUT | `/jobs/{id}` | Update full record |
| DELETE | `/jobs/{id}` | Delete application |
| GET | `/jobs/status/{status}` | Filter by status |
| GET | `/jobs/search?keyword=` | Search company or role |
| GET | `/jobs/stats` | Total count + count per status |
| PATCH | `/jobs/{id}/status` | Change status only |

**Status codes I handled:**
- `201` — job created
- `204` — job deleted
- `404` — job not found
- `400` — validation failed

---

## Frontend — what it does

The React app talks to the backend only through REST (Axios). No direct DB access from frontend.

- Form to add a new job
- List of all applications
- Dropdown to update status (calls `PATCH /jobs/{id}/status`)
- Delete button per row
- Search box — hits `GET /jobs/search` on the server
- Stats bar on top — total, applied, interview, rejected counts

UI is plain CSS, no component library. Kept it simple on purpose.

---

## How to run locally

### 1. MySQL

Start MySQL and update password in:

`backend/src/main/resources/application.properties`

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Database `job_tracker` gets created automatically on first run.

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Check: open `http://localhost:8080/jobs` — should return `[]` or a JSON array.

> **Note:** Project targets Java 17. If you have a very new JDK (24+), use JDK 17 or 21 in your IDE to avoid compiler issues.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

Optional — create `frontend/.env` if backend URL is different:

```env
VITE_API_BASE=http://localhost:8080
```

### 4. Test APIs with Postman

Import `postman_collection.json` from project root.  
Set variable `baseUrl` = `http://localhost:8080`.  
After creating a job, set `jobId` to that job's ID for update/delete tests.

---

## Sample API request

**Create a job:**

```http
POST /jobs
Content-Type: application/json

{
  "companyName": "TCS",
  "role": "Java Developer",
  "status": "APPLIED",
  "appliedDate": "2026-06-15"
}
```

**Update status only:**

```http
PATCH /jobs/1/status
Content-Type: application/json

{
  "status": "INTERVIEW"
}
```

---

## Things I learned while building this

- Keeping DTOs separate from entities makes the API cleaner and validation easier
- `@ControllerAdvice` saves a lot of repeated try-catch in controllers
- Server-side search is better than filtering in React when data grows
- `PATCH` for status-only update vs `PUT` for full update — small difference but cleaner API design
- CORS had to be enabled on backend (`@CrossOrigin`) so React on `:5173` can call API on `:8080`

---


