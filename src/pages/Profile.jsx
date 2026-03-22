// src/pages/Profile.jsx
// This is the PUBLIC page — no login required.
// Accessible at: statuspage.app/:username

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const AVAIL_CONFIG = {
  available: { label: 'Available',     bg: '#E1F5EE', color: '#0F6E56', border: '#1D9E75', dot: '#1D9E75' },
  focused:   { label: 'Deep focus',    bg: '#EEEDFE', color: '#534AB7', border: '#7F77DD', dot: '#7F77DD' },
  meeting:   { label: 'In a meeting',  bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27', dot: '#EF9F27' },
  offline:   { label: 'Out for today', bg: '#FCEBEB', color: '#A32D2D', border: '#E24B4A', dot: '#E24B4A' },
}

const STATUS_CARDS = [
  { key: 'today',    label: 'Working on today',      dot: '#7F77DD' },
  { key: 'thisWeek', label: 'In progress this week',  dot: '#1D9E75' },
  { key: 'shipped',  label: 'Recently shipped',       dot: '#EF9F27' },
  { key: 'blocked',  label: 'Blocked on',             dot: '#E24B4A' },
]

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const q = query(collection(db, 'users'), where('username', '==', username))
        const snap = await getDocs(q)
        if (snap.empty) { setNotFound(true); setLoading(false); return }
        setProfile(snap.docs[0].data())
      } catch (e) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <FullLoader />

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>User not found</h2>
      <p style={{ color: '#888780' }}>No one goes by <strong>@{username}</strong> on StatusPage.</p>
      <Link to="/" style={{ padding: '10px 24px', background: '#7F77DD', color: '#fff', borderRadius: 8, fontWeight: 500 }}>Create your own →</Link>
    </div>
  )

  const avail = AVAIL_CONFIG[profile.availability] || AVAIL_CONFIG.available
  const initials = (profile.displayName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const updatedAt = profile.updatedAt?.toDate ? profile.updatedAt.toDate() : null
  const timeAgo = updatedAt ? formatTimeAgo(updatedAt) : null

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
      {/* Minimal nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 17, color: '#534AB7' }}>statuspage</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={copyLink} style={{ padding: '7px 16px', borderRadius: 8, background: '#EEEDFE', color: '#534AB7', fontWeight: 500, fontSize: 13 }}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <Link to="/" style={{ padding: '7px 16px', borderRadius: 8, background: '#7F77DD', color: '#fff', fontWeight: 500, fontSize: 13 }}>
            Get your page →
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
          {profile.photoURL
            ? <img src={profile.photoURL} alt={initials} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#534AB7' }}>{initials}</div>
          }
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{profile.displayName}</h1>
            {(profile.role || profile.company) && (
              <p style={{ fontSize: 14, color: '#888780' }}>
                {[profile.role, profile.company].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 999, background: avail.bg, border: `1px solid ${avail.border}`, color: avail.color, fontSize: 13, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: avail.dot }} />
            {avail.label}
          </span>
        </div>

        {/* Status cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STATUS_CARDS.map(card => (
            profile[card.key] ? (
              <div key={card.key} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                </div>
                <p style={{ fontSize: 15, color: '#2C2C2A', lineHeight: 1.7 }}>{profile[card.key]}</p>
              </div>
            ) : null
          ))}
        </div>

        {/* Footer */}
        <p style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: '#B4B2A9' }}>
          {timeAgo ? `Updated ${timeAgo}` : ''} · <Link to="/" style={{ color: '#7F77DD', fontWeight: 500 }}>Create your StatusPage</Link>
        </p>
      </div>
    </div>
  )
}

function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function FullLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #EEEDFE', borderTop: '3px solid #7F77DD', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
