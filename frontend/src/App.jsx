import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function statusPillClass(status) {
  if (status === 'APPLIED') return 'pill pillApplied'
  if (status === 'INTERVIEW') return 'pill pillInterview'
  if (status === 'REJECTED') return 'pill pillRejected'
  return 'pill'
}

function App() {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('APPLIED')
  const [appliedDate, setAppliedDate] = useState(() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })

  const [query, setQuery] = useState('')

  async function loadStats() {
    try {
      const res = await axios.get(`${API_BASE}/jobs/stats`)
      setStats(res.data)
    } catch {
      setStats(null)
    }
  }

  async function loadJobs(searchKeyword = query) {
    setLoading(true)
    setError('')
    try {
      const trimmed = searchKeyword.trim()
      const url = trimmed
        ? `${API_BASE}/jobs/search?keyword=${encodeURIComponent(trimmed)}`
        : `${API_BASE}/jobs`
      const res = await axios.get(url)
      setJobs(res.data)
      await loadStats()
    } catch (e) {
      setError('Failed to load jobs. Is the backend running on :8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs('')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const filteredJobs = useMemo(() => jobs, [jobs])

  async function createJob(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { companyName, role, status, appliedDate }
      await axios.post(`${API_BASE}/jobs`, payload)
      setCompanyName('')
      setRole('')
      setStatus('APPLIED')
      await loadJobs(query)
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        'Create failed. Please check inputs and try again.'
      setError(msg)
    }
  }

  async function updateJobStatus(job, nextStatus) {
    setError('')
    try {
      const res = await axios.patch(`${API_BASE}/jobs/${job.id}/status`, {
        status: nextStatus,
      })
      setJobs((prev) => prev.map((j) => (j.id === job.id ? res.data : j)))
      await loadStats()
    } catch (e) {
      setError('Update failed. Please try again.')
    }
  }

  async function deleteJob(id) {
    setError('')
    try {
      await axios.delete(`${API_BASE}/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      await loadStats()
    } catch (e) {
      setError('Delete failed. Please try again.')
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Job Tracker</h1>
        <p className="muted">React frontend integrated with Spring Boot REST API</p>
      </div>

      {stats ? (
        <div className="statsBar">
          <span>
            <strong>{stats.total}</strong> total applications
          </span>
          <span className="muted">Applied: {stats.byStatus?.APPLIED ?? 0}</span>
          <span className="muted">Interview: {stats.byStatus?.INTERVIEW ?? 0}</span>
          <span className="muted">Rejected: {stats.byStatus?.REJECTED ?? 0}</span>
        </div>
      ) : null}

      <div className="card">
        <form onSubmit={createJob}>
          <div className="grid">
            <div className="field">
              <label>Company</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div className="field">
              <label>Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Backend Engineer"
                required
              />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="APPLIED">APPLIED</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <div className="field">
              <label>Applied Date</label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="actions">
            <button type="button" className="btn" onClick={() => loadJobs(query)}>
              Refresh
            </button>
            <button type="submit" className="btn btnPrimary">
              Add Job
            </button>
          </div>
        </form>
        {error ? <div className="error">{error}</div> : null}
        {loading ? <div className="loading">Loading…</div> : null}
      </div>

      <div className="toolbar">
        <strong>Applications ({filteredJobs.length})</strong>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company or role…"
        />
      </div>

      <div className="list">
        {filteredJobs.map((job) => (
          <div className="card" key={job.id}>
            <div className="row">
              <div className="colSpan2">
                <div style={{ fontWeight: 700 }}>
                  {job.companyName} — {job.role}
                </div>
                <div className="muted">Applied: {job.appliedDate}</div>
              </div>

              <div>
                <span className={statusPillClass(job.status)}>{job.status}</span>
              </div>

              <div>
                <select
                  value={job.status}
                  onChange={(e) => updateJobStatus(job, e.target.value)}
                >
                  <option value="APPLIED">APPLIED</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="actions" style={{ justifyContent: 'flex-end' }}>
                <button className="btn" onClick={() => deleteJob(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredJobs.length === 0 ? (
          <div className="muted">No jobs yet. Add your first application above.</div>
        ) : null}
      </div>
    </div>
  )
}

export default App
