import React, { useEffect, useState } from 'react'

export default function KeysManager({ serviceName, serviceObj = { meta: {}, keys: {} }, onChangeKeys, autoLoad = false, readOnly = false }) {
  const [keys, setKeys] = useState({})
  const [loaded, setLoaded] = useState(false) // whether keys are displayed (loaded from storage)
  const [keyName, setKeyName] = useState('')
  const [keyValue, setKeyValue] = useState('')
  const [editing, setEditing] = useState(null)

  // reset loaded state when switching services
  useEffect(() => {
    setLoaded(false)
    setKeys({})
    setKeyName('')
    setKeyValue('')
    setEditing(null)
  }, [serviceName])

  // when loaded and serviceObj changes, refresh keys
  useEffect(() => {
    if (loaded) setKeys(serviceObj.keys || {})
  }, [serviceObj, loaded])

  // support autoLoad prop
  useEffect(() => {
    if (autoLoad) {
      setLoaded(true)
      setKeys(serviceObj.keys || {})
    }
  }, [autoLoad, serviceObj])

  // persist changes up to parent
  useEffect(() => {
    if (!loaded) return
    try {
      const svcKeys = (serviceObj && serviceObj.keys) || {}
      const a = JSON.stringify(keys || {})
      const b = JSON.stringify(svcKeys || {})
      if (a !== b) {
        onChangeKeys && onChangeKeys(keys)
      }
    } catch (err) {
      // fallback: still notify
      onChangeKeys && onChangeKeys(keys)
    }
  }, [keys, loaded, serviceObj])

  function loadKeys() {
    setKeys(serviceObj.keys || {})
    setLoaded(true)
  }

  function addOrUpdate(e) {
    e.preventDefault()
    if (!keyName) return
    const next = { ...keys, [keyName]: keyValue }
    setKeys(next)
    setKeyName('')
    setKeyValue('')
    setEditing(null)
    setLoaded(true)
  }

  function editKey(name) {
    setEditing(name)
    setKeyName(name)
    setKeyValue(keys[name])
  }

  function deleteKey(name) {
    const next = { ...keys }
    delete next[name]
    setKeys(next)
  }

  return (
    <div className="keys-root">
      <div className="keys-header">
        <h3>{serviceName}</h3>
        <div className="keys-actions">
          <button className="btn small" onClick={loadKeys}>{loaded ? 'Keys loaded' : 'Get keys'}</button>
        </div>
      </div>

      {!readOnly && (
        <form className="key-form" onSubmit={addOrUpdate}>
          <input placeholder="Key name" value={keyName} onChange={e => setKeyName(e.target.value)} />
          <input placeholder="Value" value={keyValue} onChange={e => setKeyValue(e.target.value)} />
          <button className="btn" type="submit">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}

      <div className="keys-list">
        {!loaded && <div className="muted">Keys are hidden. Click "Get keys" to load saved keys.</div>}
        {loaded && Object.keys(keys).length === 0 && <div className="muted">No keys yet</div>}
        {loaded && Object.entries(keys).map(([k, v]) => (
          <div className="key-item" key={k}>
            <div className="key-meta">
              <div className="key-name">{k}</div>
              <div className="key-value">{v}</div>
            </div>
            {!readOnly && (
              <div className="key-controls">
                <button className="btn-mini" onClick={() => editKey(k)}>✎</button>
                <button className="btn-mini" onClick={() => deleteKey(k)}>✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
