# Job Tracker (Full-Stack)

Full-stack Job Tracker application.

- **Backend**: Java 17, Spring Boot (REST), Spring Data JPA, Validation, MySQL
- **Frontend**: React (Vite) + Axios

## Folder structure

```
Job_Tracker/
  backend/                 # Spring Boot API (port 8080)
  frontend/                # React app (port 5173)
  README.md
```

## Backend (Spring Boot + MySQL)

### Features implemented

- **Layered architecture**: Controller → Service → Repository
- **Entity**: `Job` with fields
  - `id` (Long, primary key)
  - `companyName` (String)
  - `role` (String)
  - `status` (Enum: APPLIED, INTERVIEW, REJECTED)
  - `appliedDate` (LocalDate)
- **DTO layer**: `JobRequest`, `JobResponse`
- **Input validation**: `@Valid` + Bean Validation annotations
- **Global exception handling**: `@ControllerAdvice`
- **HTTP status codes**:
  - `POST /jobs` → 201 Created
  - `DELETE /jobs/{id}` → 204 No Content
  - Not found → 404
  - Validation errors → 400

### API endpoints

- `POST /jobs` → create job
- `GET /jobs` → get all jobs
- `GET /jobs/{id}` → get job by id
- `PUT /jobs/{id}` → update job
- `DELETE /jobs/{id}` → delete job

### MySQL setup

1. Start MySQL and create a database (optional, the URL also uses `createDatabaseIfNotExist=true`):

```sql
CREATE DATABASE job_tracker;
```

2. Update credentials in:
`backend/src/main/resources/application.properties`

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Run backend

From `Job_Tracker/backend`:

```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Frontend (React)

### Features implemented

- **Add job** (company, role, status, applied date)
- **View all jobs**
- **Update status** (dropdown per row)
- **Delete job**
- **Search** by company or role (client-side)

### Configure API base URL

Frontend uses `frontend/.env`:

```env
VITE_API_BASE=http://localhost:8080
```

### Run frontend

From `Job_Tracker/frontend`:

```bash
npm install
npm run dev
```

Open the UI at `http://localhost:5173`.

## How the backend is organized (clean architecture)

Backend packages:

- **`com.jobtracker.jobs.controller`**
  - `JobController`: REST endpoints, request validation (`@Valid`), status codes
- **`com.jobtracker.jobs.service`**
  - `JobService`: interface
  - `JobServiceImpl`: business logic (create/read/update/delete)
- **`com.jobtracker.jobs.repository`**
  - `JobRepository`: JPA repository for DB access
- **`com.jobtracker.jobs.dto`**
  - `JobRequest`: inbound validated request payload
  - `JobResponse`: outbound response payload
- **`com.jobtracker.jobs.mapper`**
  - `JobMapper`: maps DTOs ↔ entity (keeps controller/service clean)
- **`com.jobtracker.common.error`**
  - `GlobalExceptionHandler`: centralized error responses

## Example requests

### Create a job

```http
POST /jobs
Content-Type: application/json

{
  "companyName": "Acme",
  "role": "Java Developer",
  "status": "APPLIED",
  "appliedDate": "2026-04-23"
}
```

### Update a job

```http
PUT /jobs/1
Content-Type: application/json

{
  "companyName": "Acme",
  "role": "Java Developer",
  "status": "INTERVIEW",
  "appliedDate": "2026-04-23"
}
```

## Notes / assumptions

- `PUT /jobs/{id}` updates **all** fields (simple and predictable). The UI uses it for status changes by sending the full job payload.
- Hibernate `ddl-auto=update` is enabled for easy local development; for production use migrations (Flyway/Liquibase).

