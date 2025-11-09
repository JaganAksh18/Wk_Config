import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ user, onLogout }) {
  const navigate = useNavigate()
  return (
    <header style={{ width: '100%', maxWidth: 1100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px auto' }}>
      <div>
        <h2 style={{ margin: 0 }}>Welcome, {user.username}</h2>
        <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Manage registered services and their keys</div>
      </div>

      <div className="header-actions">
        <button className="btn primary" onClick={() => navigate('/register')}>Register service</button>
        <button className="btn" onClick={() => navigate('/select/edit')}>Add / Update config</button>
        <button className="btn" onClick={() => navigate('/select/get')}>Get config</button>
        <button className="btn ghost" onClick={() => { localStorage.removeItem('currentUser'); onLogout(); }}>Logout</button>
      </div>
    </header>
  )
}
