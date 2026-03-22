import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ease, pageStagger, micro, feedback } from '../lib/motion';
import { SAVED_FEEDBACK_MS, COPIED_FEEDBACK_MS } from '../lib/feedback';
import { Navbar } from '../components/layout/Navbar';
import { SectionHeader } from '../components/layout/SectionHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/ui/Loader';
import { Card } from '../components/ui/Card';
import { TaskList } from '../components/features/TaskList';
import { AvailabilitySelector } from '../components/features/AvailabilitySelector';
import { FIELD_ACCENTS } from '../lib/fieldAccents';

const FIELDS = [
  { key: 'today', label: 'Working on today', placeholder: 'e.g. Reviewing PR #142', icon: '⚡' },
  { key: 'thisWeek', label: 'In progress this week', placeholder: 'e.g. Q3 roadmap planning', icon: '🗓' },
  { key: 'shipped', label: 'Recently shipped', placeholder: 'e.g. Dark mode rollout', icon: '✦' },
  { key: 'blocked', label: 'Blocked on', placeholder: 'e.g. Waiting on design review', icon: '⊘' },
];

const pageVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: pageStagger },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const copyLabelMotion = {
  initial: { opacity: 0, y: 2, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -2, scale: 0.98 },
  transition: { duration: feedback.duration, ease },
};

const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '')
    return [{ id: Date.now() + Math.random(), text: val, completed: false }];
  return [];
};

function formatUpdated(d) {
  if (!d) return 'Never';
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${dateStr} · ${timeStr}`;
}

function IconSave() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 21v-8H7v8M7 3v5h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheckWhite() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SaveSpinner() {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="14 32"
        opacity={0.95}
      />
    </motion.svg>
  );
}

function SaveWorkspaceButton({ saving, saved, onSave }) {
  const idle = !saving && !saved;
  return (
    <motion.button
      type="button"
      onClick={onSave}
      disabled={saving}
      whileHover={saving ? {} : { y: -1 }}
      whileTap={saving ? {} : { scale: 0.98 }}
      transition={{ duration: micro.duration, ease: micro.ease }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        minWidth: '158px',
        padding: '9px 16px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: saving ? 'wait' : 'pointer',
        background: 'var(--accent)',
        color: '#fff',
        boxShadow: 'var(--shadow-accent)',
        opacity: saving ? 0.75 : 1,
        transition: 'opacity 140ms var(--ease)',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={saving ? 'saving' : saved ? 'saved' : 'idle'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}
        >
          {idle && <IconSave />}
          {saving && <SaveSpinner />}
          {saved && !saving && <IconCheckWhite />}
          {idle && 'Save workspace'}
          {saving && 'Saving…'}
          {saved && !saving && 'Saved'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [uid, setUid] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    today: [],
    thisWeek: [],
    shipped: [],
    blocked: [],
    availability: 'available',
    role: '',
    company: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate('/');
        return;
      }
      setUid(u.uid);
      const snap = await getDoc(doc(db, 'users', u.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setForm({
          displayName: data.displayName || '',
          today: ensureArray(data.today),
          thisWeek: ensureArray(data.thisWeek),
          shipped: ensureArray(data.shipped),
          blocked: ensureArray(data.blocked),
          availability: data.availability || 'available',
          role: data.role || '',
          company: data.company || '',
        });
      }
    });
    return unsub;
  }, [navigate]);

  const save = async () => {
    if (!uid) return;
    setSaving(true);
    await updateDoc(doc(db, 'users', uid), { ...form, updatedAt: serverTimestamp() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), SAVED_FEEDBACK_MS);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  const profileUrl = userData ? `${window.location.origin}/${userData.username}` : '';

  if (!userData) return <Loader />;

  const updatedDate = userData.updatedAt?.toDate ? userData.updatedAt.toDate() : null;

  return (
    <div style={styles.pageWrap}>
      <Navbar
        logo={
          <Link to="/" style={styles.navLogo}>
            <span style={styles.logoDot} />
            <span style={styles.logoText}>Pingless.</span>
          </Link>
        }
        actions={
          <>
            <div className="dashboard-hide-url" style={styles.urlChip}>
              <span style={styles.urlChipText}>/{userData.username}</span>
            </div>

            <Button variant="secondary" onClick={copyLink} style={{ minWidth: '100px' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'copied' : 'idle'}
                  {...copyLabelMotion}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {copied ? 'Copied ✓' : 'Copy link'}
                </motion.span>
              </AnimatePresence>
            </Button>

            <Button variant="secondary" onClick={() => navigate(`/${userData.username}`)}>
              View page →
            </Button>
            <button type="button" onClick={logout} style={styles.signOutBtn}>
              Sign out
            </button>
          </>
        }
      />

      <motion.div variants={pageVariants} initial="hidden" animate="show" style={styles.body}>
        <motion.div variants={cardVariants} className="dashboard-page-title" style={styles.pageTitle}>
          <div>
            <h1 style={styles.h1}>My Workspace</h1>
            <p style={styles.lastUpdated}>
              Last updated:{' '}
              <span style={styles.lastUpdatedInner}>{formatUpdated(updatedDate)}</span>
            </p>
          </div>

          <div style={styles.saveRow}>
            <SaveWorkspaceButton saving={saving} saved={saved} onSave={save} />
          </div>
        </motion.div>

        <div className="dashboard-settings-row" style={styles.settingsRow}>
          <motion.div variants={cardVariants}>
            <Card>
              <SectionHeader label="Identity" />
              <div className="pingless-identity-group">
                <Input
                  id="displayName"
                  label="Display name"
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  placeholder="e.g. Alex Johnson"
                />
                <div style={styles.identityRow}>
                  <Input
                    id="role"
                    label="Role"
                    containerStyle={{ flex: 1, minWidth: 0 }}
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Senior Engineer"
                  />
                  <Input
                    id="company"
                    label="Team"
                    containerStyle={{ flex: 1, minWidth: 0 }}
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card>
              <SectionHeader label="Availability" />
              <AvailabilitySelector
                value={form.availability}
                onChange={(key) => setForm((f) => ({ ...f, availability: key }))}
              />
            </Card>
          </motion.div>
        </div>

        <div className="dashboard-fields-grid" style={styles.fieldsGrid}>
          {FIELDS.map((f) => {
            const accent = FIELD_ACCENTS[f.key];
            const tasks = form[f.key];
            const done = tasks.filter((t) => t.completed).length;
            const total = tasks.length;
            return (
              <motion.div
                key={f.key}
                variants={cardVariants}
                style={styles.fieldCardOuter}
                className="pingless-field-card"
              >
                <div style={{ ...styles.fieldAccentBar, background: accent }} />
                <div style={styles.fieldInner}>
                  <div style={styles.fieldHeader}>
                    <div style={styles.fieldHeaderLeft}>
                      <span style={styles.fieldIconPill}>{f.icon}</span>
                      <span style={styles.fieldLabel}>{f.label}</span>
                    </div>
                    {total > 0 && (
                      <div style={styles.fieldProgress}>
                        <Badge>
                          {done}/{total}
                        </Badge>
                        <div style={styles.miniTrack}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(done / total) * 100}%` }}
                            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
                            style={styles.miniFill}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <TaskList
                    items={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(newItems) => setForm((prev) => ({ ...prev, [f.key]: newItems }))}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div variants={cardVariants} className="dashboard-bottom-save">
          <Button variant="primary" fullWidth loading={saving} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save workspace'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
  },

  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    textDecoration: 'none',
  },
  logoDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'inline-block',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '16px',
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
  },
  urlChip: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-sunken)',
    border: '1px solid var(--border-mid)',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-3)',
  },
  urlChipText: {
    color: 'var(--text-2)',
  },
  signOutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-2)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 10px',
  },

  body: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '36px var(--space-10) var(--space-20)',
    width: '100%',
  },

  pageTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-8)',
  },
  h1: {
    fontFamily: 'var(--font-serif)',
    fontSize: '28px',
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    margin: '0 0 4px',
    lineHeight: 1.1,
  },
  lastUpdated: {
    fontSize: '12px',
    color: 'var(--text-3)',
    fontWeight: 400,
    margin: 0,
    fontFamily: 'var(--font-mono)',
  },
  lastUpdatedInner: {
    color: 'var(--text-3)',
  },

  saveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    minHeight: '44px',
  },

  settingsRow: {
    marginBottom: 'var(--space-4)',
  },

  identityRow: {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  },

  fieldsGrid: {},

  fieldCardOuter: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xs)',
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  },
  fieldAccentBar: {
    width: '3px',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  fieldInner: {
    flex: 1,
    padding: '20px 20px 20px 18px',
    minWidth: 0,
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  },
  fieldHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    minWidth: 0,
  },
  fieldIconPill: {
    width: '26px',
    height: '26px',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
    background: 'var(--bg-soft)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)',
  },
  fieldLabel: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  fieldProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    flexShrink: 0,
  },
  miniTrack: {
    width: '40px',
    height: '3px',
    borderRadius: '2px',
    background: 'var(--bg-soft)',
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'var(--text-3)',
  },
};
