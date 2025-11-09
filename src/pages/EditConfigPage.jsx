import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import KeysManager from '../components/KeysManager'
import { readAllServices, writeAllServices } from '../lib/storage'

export default function EditConfigPage() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [svc, setSvc] = useState(null)
  const [userServices, setUserServices] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return navigate('/')
    const user = JSON.parse(stored)
    const all = readAllServices()
    const u = all[user.username] || {}
    setUserServices(all)
    setSvc(u[name] || null)
  }, [name])

  function onChangeKeys(keys) {
    if (!svc) return
    const stored = localStorage.getItem('currentUser')
    if (!stored) return navigate('/')
    const user = JSON.parse(stored)
    // re-read latest services to avoid overwriting concurrent updates
    const all = readAllServices()
    const u = all[user.username] || {}
    all[user.username] = { ...u, [name]: { ...u[name], keys } }
    writeAllServices(all)
    setSvc({ ...svc, keys })
  }

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
        <h2>Edit configuration — {name}</h2>
        <div className="muted">{svc.meta.email}</div>
        <div className="muted">{svc.meta.description}</div>

        <KeysManager serviceName={name} serviceObj={svc} onChangeKeys={onChangeKeys} autoLoad={true} />

        <div style={{ marginTop: 12 }}>
          <button className="btn ghost" onClick={() => navigate('/')}>Done</button>
        </div>
      </div>
    </div>
  )
}
