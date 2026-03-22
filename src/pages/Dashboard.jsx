// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'

const AVAIL = [
  { key: 'available', label: 'Available',     bg: '#E1F5EE', color: '#0F6E56', border: '#1D9E75' },
  { key: 'focused',   label: 'Deep focus',    bg: '#EEEDFE', color: '#534AB7', border: '#7F77DD' },
  { key: 'meeting',   label: 'In a meeting',  bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27' },
  { key: 'offline',   label: 'Out for today', bg: '#FCEBEB', color: '#A32D2D', border: '#E24B4A' },
]

const FIELDS = [
  { key: 'today',     label: 'Working on today',     placeholder: 'e.g. Reviewing PR #142, fixing login bug', dot: '#7F77DD' },
  { key: 'thisWeek',  label: 'In progress this week', placeholder: 'e.g. Q3 roadmap, onboarding redesign',    dot: '#1D9E75' },
  { key: 'shipped',   label: 'Recently shipped',      placeholder: 'e.g. Dark mode, payment v2',              dot: '#EF9F27' },
  { key: 'blocked',   label: 'Blocked on',            placeholder: 'e.g. Waiting on design review',           dot: '#E24B4A' },
]

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [form, setForm] = useState({ today: '', thisWeek: '', shipped: '', blocked: '', availability: 'available', role: '', company: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uid, setUid] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/'); return }
      setUid(u.uid)
      const snap = await getDoc(doc(db, 'users', u.uid))
      if (snap.exists()) {
        const data = snap.data()
        setUserData(data)
        setForm({
          today: data.today || '',
          thisWeek: data.thisWeek || '',
          shipped: data.shipped || '',
          blocked: data.blocked || '',
          availability: data.availability || 'available',
          role: data.role || '',
          company: data.company || '',
        })
      }
    })
    return unsub
  }, [navigate])

  const save = async () => {
    if (!uid) return
    setSaving(true)
    await updateDoc(doc(db, 'users', uid), { ...form, updatedAt: serverTimestamp() })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const profileUrl = userData ? `${window.location.origin}/${userData.username}` : ''

  if (!userData) return <Loader />

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
      {/* Top nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#534AB7' }}>statuspage</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: '#888780', background: '#f1f0ee', padding: '6px 12px', borderRadius: 8 }}>
            {profileUrl}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(profileUrl) }}
            style={{ padding: '8px 14px', borderRadius: 8, background: '#EEEDFE', color: '#534AB7', fontWeight: 500, fontSize: 13 }}
          >
            Copy link
          </button>
          <button
            onClick={() => navigate(`/${userData.username}`)}
            style={{ padding: '8px 14px', borderRadius: 8, background: '#f1f0ee', color: '#444441', fontWeight: 500, fontSize: 13 }}
          >
            View public page →
          </button>
          <button
            onClick={logout}
            style={{ padding: '8px 14px', borderRadius: 8, background: 'transparent', color: '#888780', fontSize: 13 }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>My status</h1>
          <p style={{ color: '#888780', fontSize: 14 }}>Last updated: {userData.updatedAt?.toDate ? userData.updatedAt.toDate().toLocaleString() : 'never'}</p>
        </div>

        {/* Profile info row */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={labelStyle}>Job title / role</label>
            <input
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Senior Engineer"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={labelStyle}>Company / team</label>
            <input
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder="e.g. Acme Corp"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Availability */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
          <p style={labelStyle}>Availability</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {AVAIL.map(a => (
              <button
                key={a.key}
                onClick={() => setForm(f => ({ ...f, availability: a.key }))}
                style={{
                  padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                  background: form.availability === a.key ? a.bg : '#f8f8f6',
                  color: form.availability === a.key ? a.color : '#888780',
                  border: `1px solid ${form.availability === a.key ? a.border : '#e0e0de'}`,
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FIELDS.map(f => (
            <div key={f.key} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.dot, flexShrink: 0 }} />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              </div>
              <textarea
                rows={3}
                value={form[f.key]}
                placeholder={f.placeholder}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ width: '100%', border: '1px solid #e0e0de', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#2C2C2A', resize: 'none', background: '#fafaf8', lineHeight: 1.6 }}
              />
            </div>
          ))}
        </div>

        {/* Save button */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={save}
            disabled={saving}
            style={{ padding: '12px 32px', borderRadius: 10, background: '#7F77DD', color: '#fff', fontWeight: 600, fontSize: 15, opacity: saving ? 0.7 : 1, transition: 'opacity 0.15s' }}
          >
            {saving ? 'Saving...' : 'Save status'}
          </button>
          {saved && <span style={{ color: '#0F6E56', fontSize: 14, fontWeight: 500 }}>✓ Saved! Your public page is live.</span>}
        </div>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', marginTop: 8, border: '1px solid #e0e0de', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#2C2C2A', background: '#fafaf8' }

function Loader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #EEEDFE', borderTop: '3px solid #7F77DD', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
