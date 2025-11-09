import React, { useState } from 'react'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('signin') // or 'signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function resetForm() {
    setUsername('')
    setPassword('')
    setError('')
  }

  function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!username || !password) return setError('Please provide username and password')
    const users = readUsers()
    if (users.find(u => u.username === username)) return setError('Username already exists')
    const newUser = { username, password }
    users.push(newUser)
    writeUsers(users)
    // For demo security: after sign up we require an explicit sign-in
    setSuccess('Account created. Please sign in.')
    setMode('signin')
    resetForm()
  }

  function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!username || !password) return setError('Please provide username and password')
    const users = readUsers()
    const match = users.find(u => u.username === username && u.password === password)
    if (!match) return setError('Invalid credentials')
    onLogin({ username })
    resetForm()
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
          <div className="auth-toggle">
            <button
              className={`link ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError('') }}
            >
              Sign In
            </button>
            <button
              className={`link ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError('') }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="auth-form">
          <label>
            <span>Username</span>
            <input value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn primary">{mode === 'signin' ? 'Sign In' : 'Create account'}</button>
          </div>
        </form>

        <div className="auth-note">
         {/* <p>This app stores accounts locally (for demo only). No external DB required.</p> */}
        </div>
      </div>
    </div>
  )
}
