// src/pages/Landing.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AVAILABILITY_COLORS = {
  available: { bg: '#E1F5EE', color: '#0F6E56', dot: '#1D9E75', label: 'Available' },
  focused:   { bg: '#EEEDFE', color: '#534AB7', dot: '#7F77DD', label: 'Deep focus' },
  meeting:   { bg: '#FAEEDA', color: '#854F0B', dot: '#EF9F27', label: 'In a meeting' },
  offline:   { bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A', label: 'Out for today' },
}

export default function Landing() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard')
  }, [user, loading, navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ebebeb', background: '#fff' }}>
        <span style={{ fontWeight: 600, fontSize: 18, color: '#534AB7', letterSpacing: '-0.3px' }}>statuspage</span>
        <button onClick={login} style={{ padding: '8px 20px', borderRadius: 8, background: '#7F77DD', color: '#fff', fontWeight: 500, fontSize: 14 }}>
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['async-first', 'no more pings', 'one link'].map(tag => (
            <span key={tag} style={{ padding: '4px 14px', borderRadius: 999, background: '#EEEDFE', color: '#534AB7', fontSize: 13, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px', maxWidth: 640 }}>
          Your work status,<br />
          <span style={{ color: '#7F77DD' }}>on one link.</span>
        </h1>

        <p style={{ fontSize: 17, color: '#5F5E5A', maxWidth: 460, marginBottom: 40, lineHeight: 1.7 }}>
          Share what you're working on, what's blocked, and what you shipped — all on a beautiful public page your teammates can check any time.
        </p>

        {/* URL Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e0e0de', borderRadius: 10, padding: '10px 10px 10px 18px', marginBottom: 28, fontSize: 15 }}>
          <span style={{ color: '#888780' }}>statuspage.app/</span>
          <span style={{ color: '#2C2C2A', fontWeight: 600 }}>yourname</span>
        </div>

        <button
          onClick={login}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 28px', borderRadius: 12, background: '#7F77DD', color: '#fff', fontWeight: 600, fontSize: 16, boxShadow: '0 4px 20px rgba(127,119,221,0.35)', transition: 'transform 0.15s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <GoogleIcon />
          Continue with Google — it's free
        </button>
        <p style={{ marginTop: 14, fontSize: 13, color: '#888780' }}>No credit card · Free forever</p>

        {/* Cards Preview */}
        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: '100%', maxWidth: 800, textAlign: 'left' }}>
          {[
            { dot: '#7F77DD', label: 'Working on today', value: 'Refactoring the auth module, reviewing PR #142' },
            { dot: '#1D9E75', label: 'In progress this week', value: 'Q3 roadmap planning, onboarding flow redesign' },
            { dot: '#EF9F27', label: 'Recently shipped', value: 'Dark mode rollout, payment integration v2' },
            { dot: '#E24B4A', label: 'Blocked on', value: 'Waiting on design review from Priya' },
          ].map(card => (
            <div key={card.label} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
              </div>
              <p style={{ fontSize: 14, color: '#444441', lineHeight: 1.6 }}>{card.value}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', fontSize: 13, color: '#888780', borderTop: '1px solid #ebebeb' }}>
        Built with React + Firebase · 100% free
      </footer>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#fff" opacity=".9"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#fff" opacity=".9"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" opacity=".9"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff" opacity=".9"/>
    </svg>
  )
}
