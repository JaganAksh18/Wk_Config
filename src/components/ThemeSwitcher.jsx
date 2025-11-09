import React, { useEffect } from 'react'

// Single dark theme switcher (kept as a small badge in case we want to expand later)
export default function ThemeSwitcher() {
  useEffect(() => {
    const t = 'theme-dark'
    document.documentElement.classList.remove(...Array.from(document.documentElement.classList || []))
    document.documentElement.classList.add(t)
    try { localStorage.setItem('theme', t) } catch {}
  }, [])

  return (
    <div className="theme-switcher">
      <button className="theme-btn active" title="Dark theme" disabled>Dark</button>
    </div>
  )
}
