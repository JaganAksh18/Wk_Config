import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import KeysManager from './KeysManager'
import { readAllServices, writeAllServices, readLegacyServices } from '../lib/storage'

// Services are stored per-user under the key 'services_by_user'.
// storage helpers moved to src/lib/storage.js

export default function Dashboard({ user, onLogout }) {
  // services - the mapping for the current user only: { serviceName: { meta: {...}, keys: {...} } }
  // Start as null to avoid persisting an empty object on mount which can overwrite
  // existing data written by other pages. We'll persist only after services is set.
  const [services, setServices] = useState(null)
  const [serviceName, setServiceName] = useState('')
  const [serviceEmail, setServiceEmail] = useState('')
  const [serviceDesc, setServiceDesc] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [activeService, setActiveService] = useState(null)
  const [autoLoadFor, setAutoLoadFor] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // on mount, load services for this user. Migrate legacy data if present.
  useEffect(() => {
    const all = readAllServices()
    if (!all || Object.keys(all).length === 0) {
      const legacy = readLegacyServices()
      if (legacy && Object.keys(legacy).length > 0) {
        // legacy shape: { serviceName: { key: value } }
        // migrate into per-user shape
        const migrated = {}
        Object.keys(legacy).forEach(s => {
          migrated[s] = { meta: { email: '', description: '', createdAt: new Date().toISOString() }, keys: legacy[s] }
        })
  const nextAll = { ...all, [user.username]: migrated }
  // migration originated here — don't broadcast the update event to avoid loops
  writeAllServices(nextAll, false)
        try { localStorage.removeItem('services') } catch {}
        setServices(migrated)
        return
      }
    }
    const own = all[user.username] || {}
    setServices(own)

    // if navigation included a created service in state, select it
    try {
      const created = location && location.state && location.state.created
      if (created && own[created]) {
        setActiveService(created)
        // clear the history state so it doesn't persist
        try { window.history.replaceState({}, '') } catch {}
      }
    } catch {}
  }, [user.username])

  // when services change, pick a sensible default active service if none selected
  useEffect(() => {
    const keys = Object.keys(services || {})
    if (!activeService && keys.length > 0) {
      setActiveService(keys[0])
    }
  }, [services])

  // listen for external updates (register page, edits)
  useEffect(() => {
    function onUpdated() {
      const all = readAllServices()
      setServices(all[user.username] || {})
    }
    function onCreated(e) {
      const name = e && e.detail && e.detail.name
      const all = readAllServices()
      setServices(all[user.username] || {})
      if (name) setActiveService(name)
    }
    window.addEventListener('services-updated', onUpdated)
    window.addEventListener('service-created', onCreated)
    return () => {
      window.removeEventListener('services-updated', onUpdated)
      window.removeEventListener('service-created', onCreated)
    }
  }, [user.username])

  // Whenever the user's services change, persist them into the per-user map
  useEffect(() => {
    // don't persist until we've loaded the real services object (skip initial null)
    if (services === null) return
    const all = readAllServices()
    const next = { ...all, [user.username]: services }
    // persist without triggering the 'services-updated' event (we already update local state)
    writeAllServices(next, false)
  }, [services, user.username])

  function createService({ name, email, description }) {
    if (!name) return
    const meta = { email: email || '', description: description || '', createdAt: new Date().toISOString() }
    const cur = services || {}
    if (cur[name]) return // don't overwrite existing
    const next = { ...cur, [name]: { meta, keys: {} } }
    setServices(next)
  }

  function deleteService(name) {
    const cur = services || {}
    const next = { ...cur }
    delete next[name]
    setServices(next)
    if (activeService === name) setActiveService(null)
  }

  function editService(name) {
    const cur = services || {}
    if (!cur[name]) return
    navigate(`/edit/${encodeURIComponent(name)}`)
  }

  function getConfig(name) {
    // open Get Config page
    navigate(`/get/${encodeURIComponent(name)}`)
  }

  function updateServiceKeys(name, keysObj) {
    const cur = services || {}
    const svc = cur[name] || { meta: { email: '', description: '', createdAt: new Date().toISOString() }, keys: {} }
    const nextSvc = { ...svc, keys: keysObj }
    const next = { ...cur, [name]: nextSvc }
    setServices(next)
  }

  return (
    <div className="dashboard-root">

      <main className="dash-main">
        <aside className="services-list">

          <ul>
            {Object.keys(services || {}).length === 0 && <li className="muted">No services yet — add one</li>}
            {Object.keys(services || {}).map(name => (
              <li key={name} className={activeService === name ? 'active' : ''}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="link" onClick={() => setActiveService(name)}>{name}</button>
                  <button className="btn-mini" onClick={() => getConfig(name)} title="Get config">⚙</button>
                  <button className="btn-mini" onClick={() => editService(name)} title="Edit">✎</button>
                </div>
                <button className="btn-mini" onClick={() => deleteService(name)} title="Delete">✕</button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="service-panel">
          {Object.keys(services || {}).length === 0 ? (
            <div className="welcome-actions">
              <h3>Get started</h3>
              <p className="muted">Choose an action below to begin managing your services.</p>
              <div className="action-grid">
                <button className="btn large" onClick={() => navigate('/register')}>Register service</button>
                <button className="btn large" onClick={() => navigate('/select/edit')}>Add / Update config</button>
                <button className="btn large" onClick={() => navigate('/select/get')}>Get config</button>
              </div>
            </div>
          ) : activeService ? (
            <>
              <div className="service-meta">
                <h3>{activeService}</h3>
                <div className="muted">{(services[activeService] && services[activeService].meta && services[activeService].meta.email) || ''}</div>
                <div className="muted">{(services[activeService] && services[activeService].meta && services[activeService].meta.description) || ''}</div>
              </div>
              <KeysManager
                serviceName={activeService}
                serviceObj={(services[activeService] || { meta: {}, keys: {} })}
                onChangeKeys={keys => updateServiceKeys(activeService, keys)}
                autoLoad={autoLoadFor === activeService}
              />
            </>
          ) : (
            <div className="placeholder">
              <h3>Get service config</h3>
              <p className="muted">Select a service from the left and click <strong>⚙</strong> (Get config) to view its configuration.</p>
              <p className="muted">Or register a new service using the button in the header.</p>
            </div>
          )}
        </section>
      </main>
      {/* Floating Action Button for quick access */}
      <button className="fab" title="Register service" onClick={() => navigate('/register')}>＋</button>
    </div>
  )
}
