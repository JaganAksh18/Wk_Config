import React, { useState } from 'react'

export default function ServiceForm({ initial = {}, onCreate, onClose, isEdit = false, inline = false, onNameChange }) {
  const [name, setName] = useState(initial.name || '')
  const [email, setEmail] = useState(initial.email || '')
  const [desc, setDesc] = useState(initial.desc || '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name) return setError('Service name is required')
    onCreate && onCreate({ name: name.trim(), email: email.trim(), description: desc.trim() })
  }

  if (inline) {
    return (
      <form className="inline-form" onSubmit={handleSubmit}>
        <h3>{isEdit ? 'Edit Service' : 'Register Service'}</h3>
        <label>
          <span>Service name</span>
          <input value={name} onChange={e => { setName(e.target.value); try { onNameChange && onNameChange(e.target.value) } catch {} }} placeholder="My Service" disabled={isEdit} />
        </label>
        <label>
          <span>Contact email</span>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
        </label>
        <label>
          <span>Short description</span>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this service for?" />
        </label>

        {error && <div className="error">{error}</div>}

        <div className="modal-actions">
          <button type="submit" className="btn primary">Create</button>
          {onClose && <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>}
        </div>
      </form>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Service' : 'Register Service'}</h3>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <span>Service name</span>
            <input value={name} onChange={e => { setName(e.target.value); try { onNameChange && onNameChange(e.target.value) } catch {} }} placeholder="My Service" disabled={isEdit} />
          </label>
          <label>
            <span>Contact email</span>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
          </label>
          <label>
            <span>Short description</span>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this service for?" />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="btn primary">Create</button>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
