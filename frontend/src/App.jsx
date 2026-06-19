import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, Search, Plus, BarChart3, 
  CheckCircle2, Clock, XCircle, Trash2,
  RefreshCw, FileText, CheckCircle
} from 'lucide-react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://job-tracker-backend-geie.onrender.com'

function statusPillClass(status) {
  if (status === 'APPLIED') return 'pill pillApplied'
  if (status === 'INTERVIEW') return 'pill pillInterview'
  if (status === 'REJECTED') return 'pill pillRejected'
  return 'pill'
}

function statusIcon(status) {
  if (status === 'APPLIED') return <Clock size={14} />
  if (status === 'INTERVIEW') return <Briefcase size={14} />
  if (status === 'REJECTED') return <XCircle size={14} />
  return <FileText size={14} />
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="app">
      {/* Top Navigation */}
      <nav className="topNav">
        <div className="logo">
          <div className="logoIcon">
            <Briefcase size={28} />
          </div>
          JobTracker
        </div>
        <div className="navActions">
          {/* Optional: Add user avatar or settings here in the future */}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mainContent">
        
        {/* Header & Stats */}
        <motion.div 
          className="pageHeader"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>Dashboard</motion.h1>
          <motion.p variants={itemVariants}>Track and manage your job applications efficiently.</motion.p>
        </motion.div>

        {stats && (
          <motion.div 
            className="statsGrid"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="statCard" variants={itemVariants}>
              <div className="statHeader">
                Total Applications
                <div className="statIcon total"><BarChart3 size={20} /></div>
              </div>
              <div className="statValue">{stats.total}</div>
            </motion.div>

            <motion.div className="statCard" variants={itemVariants}>
              <div className="statHeader">
                Applied
                <div className="statIcon applied"><Clock size={20} /></div>
              </div>
              <div className="statValue">{stats.byStatus?.APPLIED ?? 0}</div>
            </motion.div>

            <motion.div className="statCard" variants={itemVariants}>
              <div className="statHeader">
                Interview
                <div className="statIcon interview"><Briefcase size={20} /></div>
              </div>
              <div className="statValue">{stats.byStatus?.INTERVIEW ?? 0}</div>
            </motion.div>

            <motion.div className="statCard" variants={itemVariants}>
              <div className="statHeader">
                Rejected
                <div className="statIcon rejected"><XCircle size={20} /></div>
              </div>
              <div className="statValue">{stats.byStatus?.REJECTED ?? 0}</div>
            </motion.div>
          </motion.div>
        )}

        {/* Content Grid (Form + List) */}
        <div className="contentGrid">
          
          {/* Add Job Form */}
          <motion.div 
            className="formCard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="formHeader">
              <h2>New Application</h2>
              <p>Record a new job opportunity</p>
            </div>

            <form onSubmit={createJob} className="formBody">
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

              {error && <div className="error"><XCircle size={16} /> {error}</div>}

              <button type="submit" className="btn btnPrimary">
                <Plus size={18} />
                Add Application
              </button>
            </form>
          </motion.div>

          {/* Applications List */}
          <motion.div 
            className="applicationsSection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sectionHeader">
              <h2>
                <FileText size={20} className="logoIcon" />
                Applications
                <span className="badge">{filteredJobs.length}</span>
              </h2>

              <div className="searchBox">
                <Search size={18} className="searchIcon" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by company or role…"
                />
              </div>
            </div>

            <div className="list">
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.div 
                    className="jobCard" 
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="jobInfo">
                      <div className="jobTitle">
                        <span className="companyName">{job.companyName}</span>
                        <span className="muted">—</span>
                        {job.role}
                      </div>
                      <div className="appliedDate">
                        <Clock size={12} />
                        Applied: {job.appliedDate}
                      </div>
                    </div>

                    <div className="statusWrapper">
                      <span className={statusPillClass(job.status)}>
                        {statusIcon(job.status)}
                        {job.status}
                      </span>
                    </div>

                    <div className="actionWrapper">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job, e.target.value)}
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    <div>
                      <button className="btnDelete" onClick={() => deleteJob(job.id)} title="Delete Application">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!loading && filteredJobs.length === 0 && (
                <motion.div 
                  className="emptyState"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FileText size={48} className="emptyIcon" />
                  <p>No applications found. Add your first application to start tracking.</p>
                </motion.div>
              )}

              {loading && (
                <div className="loading">
                  <RefreshCw size={24} className="spin" />
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}

export default App
