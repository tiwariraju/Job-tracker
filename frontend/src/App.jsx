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

  async function loadJobs() {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/jobs`)
      setJobs(res.data)
    } catch (e) {
      setError('Failed to load jobs. Is the backend running on :8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return jobs
    return jobs.filter((j) => {
      return (
        j.companyName?.toLowerCase().includes(q) || j.role?.toLowerCase().includes(q)
      )
    })
  }, [jobs, query])

  async function createJob(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { companyName, role, status, appliedDate }
      await axios.post(`${API_BASE}/jobs`, payload)
      setCompanyName('')
      setRole('')
      setStatus('APPLIED')
      await loadJobs()
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
      const payload = {
        companyName: job.companyName,
        role: job.role,
        status: nextStatus,
        appliedDate: job.appliedDate,
      }
      const res = await axios.put(`${API_BASE}/jobs/${job.id}`, payload)
      setJobs((prev) => prev.map((j) => (j.id === job.id ? res.data : j)))
    } catch (e) {
      setError('Update failed. Please try again.')
    }
  }

  async function deleteJob(id) {
    setError('')
    try {
      await axios.delete(`${API_BASE}/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (e) {
      setError('Delete failed. Please try again.')
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Job Tracker</h1>
        <p className="muted">Spring Boot + MySQL backend, React frontend</p>
      </div>

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
            <button type="button" className="btn" onClick={loadJobs}>
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
