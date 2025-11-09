import React, { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import EditConfigPage from './pages/EditConfigPage'
import GetConfigPage from './pages/GetConfigPage'
import SelectEditPage from './pages/SelectEditPage'
import SelectGetPage from './pages/SelectGetPage'
import TopBar from './components/TopBar'
import './index.css'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // restore session
    const stored = localStorage.getItem('currentUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  function handleLogin(userObj) {
    setUser(userObj)
    localStorage.setItem('currentUser', JSON.stringify(userObj))
  }

  // navigate to register page after login
  const navigate = useNavigate()
  useEffect(() => {
    if (user) navigate('/register')
  }, [user])

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <div className="app-root">
      {user && <TopBar user={user} onLogout={handleLogout} />}
      <Routes>
          <Route path="/" element={!user ? <Auth onLogin={handleLogin} /> : <Dashboard user={user} onLogout={handleLogout} />} />
          <Route path="/register" element={user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/select/edit" element={user ? <SelectEditPage /> : <Navigate to="/" />} />
          <Route path="/select/get" element={user ? <SelectGetPage /> : <Navigate to="/" />} />
          <Route path="/edit/:name" element={user ? <EditConfigPage /> : <Navigate to="/" />} />
          <Route path="/get/:name" element={user ? <GetConfigPage /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}
