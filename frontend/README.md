# Job Tracker — Frontend

React UI for the Job Tracker project. This talks to the Spring Boot backend running on `http://localhost:8080`.

## Stack

- **React 19** — UI and state
- **Vite** — dev server and build tool (faster than CRA)
- **Axios** — HTTP requests to REST API
- **Plain CSS** — styling in `App.css` (no Tailwind/MUI)

## What this app does

1. Shows a form to add job applications
2. Lists all jobs fetched from `GET /jobs`
3. Search box calls `GET /jobs/search?keyword=...`
4. Status dropdown calls `PATCH /jobs/{id}/status`
5. Delete button calls `DELETE /jobs/{id}`
6. Top stats bar from `GET /jobs/stats`

## Run

Make sure backend is already running on port 8080.

```bash
npm install
npm run dev
```

Open: http://localhost:5173

## Config

By default API base is `http://localhost:8080`.  
To change it, create a `.env` file:

```env
VITE_API_BASE=http://localhost:8080
```

## Main files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main page — form, list, search, API calls |
| `src/App.css` | Layout and styling |
| `src/main.jsx` | React entry point |

## Build for production

```bash
npm run build
```

Output goes to `dist/` folder.
