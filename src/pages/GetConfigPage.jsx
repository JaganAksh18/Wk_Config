import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import KeysManager from '../components/KeysManager'
import { readAllServices } from '../lib/storage'

export default function GetConfigPage() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [svc, setSvc] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return navigate('/')
    const user = JSON.parse(stored)
    const all = readAllServices()
    const u = all[user.username] || {}
    setSvc(u[name] || null)
  }, [name])

  if (!svc) return (
    <div className="page-root">
      <div className="page-card">
        <h3>Service not found</h3>
        <p className="muted">The service "{name}" was not found for your account.</p>
        <button className="btn" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  )

  return (
    <div className="page-root">
      <div className="page-card">
        <h2>Configuration — {name}</h2>
        <div className="muted">{svc.meta.email}</div>
        <div className="muted">{svc.meta.description}</div>

        {/* readOnly view of keys */}
        <KeysManager serviceName={name} serviceObj={svc} autoLoad={true} readOnly={true} />

        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => navigate(`/edit/${encodeURIComponent(name)}`)}>Edit configuration</button>
          <button className="btn ghost" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    </div>
  )
}
