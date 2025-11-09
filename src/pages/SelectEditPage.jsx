import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { readAllServices } from '../lib/storage'

export default function SelectEditPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return navigate('/')
    const user = JSON.parse(stored)
    const all = readAllServices()
    const u = all[user.username] || {}
    setServices(Object.keys(u))
  }, [])

  useEffect(() => {
    function onUpdated() {
      const stored = localStorage.getItem('currentUser')
      if (!stored) return
      const user = JSON.parse(stored)
      const all = readAllServices()
      const u = all[user.username] || {}
      setServices(Object.keys(u))
    }
    window.addEventListener('services-updated', onUpdated)
    return () => window.removeEventListener('services-updated', onUpdated)
  }, [])

  return (
    <div className="page-root">
      <div className="page-card">
        <h2>Select a service to edit</h2>
        {services.length === 0 && <div className="muted">No services available. Register one first.</div>}
        <ul>
          {services.map(s => (
            <li key={s}>
              <button className="link" onClick={() => navigate(`/edit/${encodeURIComponent(s)}`)}>{s}</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 12 }}>
          <button className="btn ghost" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    </div>
  )
}
