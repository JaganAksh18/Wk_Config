import React from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceForm from '../components/ServiceForm'
import { readAllServices, writeAllServices, readLegacyServices } from '../lib/storage'
import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return
    const user = JSON.parse(stored)
    const all = readAllServices()
  const u = all[user.username] || {}
  // store entries with meta so we can show details
  setServices(Object.entries(u).map(([name, svc]) => ({ name, meta: svc.meta || {} })))

    function onUpdated() {
      const all = readAllServices()
      const u = all[user.username] || {}
      setServices(Object.entries(u).map(([name, svc]) => ({ name, meta: svc.meta || {} })))
    }
    window.addEventListener('services-updated', onUpdated)
    return () => window.removeEventListener('services-updated', onUpdated)
  }, [])

  function onCreate(payload) {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return navigate('/')
    const user = JSON.parse(stored)
    const all = readAllServices()
    const userServices = all[user.username] || {}
    if (userServices[payload.name]) {
      // don't overwrite
      return navigate('/')
    }
    const meta = { email: payload.email || '', description: payload.description || '', createdAt: new Date().toISOString() }
    const next = { ...userServices, [payload.name]: { meta, keys: {} } }
    writeAllServices({ ...all, [user.username]: next })
    try { window.dispatchEvent(new CustomEvent('service-created', { detail: { name: payload.name } })) } catch {}
    // stay on the register page and update the local list
    setServices(prev => ([...prev, { name: payload.name, meta }]))
  }

  return (
    <div className="page-root">
      <div className="page-card">
        <h2>Register new service</h2>
        <ServiceForm onCreate={onCreate} onClose={() => {}} inline={true} />

        <hr />
        <h3>Your registered services</h3>
        {services.length === 0 && <div className="muted">No services registered yet.</div>}
        <ul>
          {services.map(s => (
            <li key={s.name} className="service-row">
              <div className="service-name">{s.name}</div>
              <div className="muted">{s.meta.email}</div>
              <div className="muted">{s.meta.description}</div>
              <div className="muted small">Created: {s.meta.createdAt ? new Date(s.meta.createdAt).toLocaleString() : '—'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
