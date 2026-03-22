import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ease, feedback } from '../lib/motion';
import { COPIED_FEEDBACK_MS } from '../lib/feedback';
import { getAvailability } from '../lib/availability';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { ProfileHeader } from '../components/features/ProfileHeader';
import { StatusCard } from '../components/features/StatusCard';

const STATUS_CARDS = [
  { key: 'today', label: 'Working on today', icon: '⚡' },
  { key: 'thisWeek', label: 'In progress this week', icon: '🗓' },
  { key: 'shipped', label: 'Recently shipped', icon: '✦' },
  { key: 'blocked', label: 'Blocked on', icon: '⊘' },
];

function hasVisibleStatusContent(val) {
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'string') return val.trim() !== '';
  return Boolean(val);
}

const copyLabelMotion = {
  initial: { opacity: 0, y: 2, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -2, scale: 0.98 },
  transition: { duration: feedback.duration, ease },
};

import { Logo } from '../components/ui/Logo';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const profileRef = useRef(null);

  const downloadPDF = async () => {
    if (!profileRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F5F4F0',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${profile.displayName || username}-Status.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProfile(snap.docs[0].data());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div style={styles.notFoundWrap}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{ textAlign: 'center', maxWidth: '400px', padding: '0 var(--space-4)' }}
        >
          <div style={styles.notFoundIcon}>🫥</div>
          <h2 style={styles.notFoundTitle}>Not found</h2>
          <p style={styles.notFoundSub}>
            No one goes by <span style={{ fontWeight: 600, color: 'var(--text)' }}>@{username}</span> on{' '}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Logo size={16} />
              Pingless
            </span>.
          </p>
          <Link to="/" style={styles.btnPrimary}>
            Create your workspace →
          </Link>
        </motion.div>
      </div>
    );
  }

  const avail = getAvailability(profile.availability);
  const initials = (profile.displayName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const updatedAt = profile.updatedAt?.toDate ? profile.updatedAt.toDate() : null;
  const timeAgo = updatedAt ? formatTimeAgo(updatedAt) : null;

  const filledCards = STATUS_CARDS.filter((c) => hasVisibleStatusContent(profile[c.key]));
  const hasContent = filledCards.length > 0;

  const footerDotColor =
    profile.availability === 'available' ? 'var(--avail-green-dot)' : 'var(--text-3)';

  return (
    <div style={styles.pageWrap}>
      <Navbar
        logo={
          <Link to="/" style={styles.navLogo}>
            <Logo size={24} />
            <span style={styles.logoText}>Pingless.</span>
          </Link>
        }
        actions={
          <>
            <Button variant="secondary" onClick={copyLink} style={{ minWidth: '104px' }}>
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
            <div className="profile-hide-export-xs">
              <Button variant="secondary" loading={downloading} disabled={downloading} onClick={downloadPDF}>
                {downloading ? 'Exporting…' : 'Export PDF'}
              </Button>
            </div>
            <Link to="/" style={styles.btnPrimary}>
              Get your page →
            </Link>
          </>
        }
      />

      <div ref={profileRef} className="profile-body" style={styles.body}>
        <div style={styles.inner}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            style={styles.headerCard}
          >
            <ProfileHeader profile={profile} avail={avail} initials={initials} />
          </motion.div>

          {hasContent ? (
            filledCards.map((card, i) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: i * 0.07 }}
              >
                <StatusCard card={card} content={profile[card.key]} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              style={styles.emptyCard}
            >
              <span style={styles.emptyCardIcon}>💤</span>
              <p style={styles.emptyCardText}>
                {profile.displayName?.split(' ')[0]} hasn&apos;t added any updates yet.
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.35, ease }}
            style={styles.footer}
          >
            {timeAgo && (
              <span style={styles.footerTime}>
                <span style={{ ...styles.footerDot, background: footerDotColor }} />
                Updated {timeAgo}
              </span>
            )}
            <Link to="/" className="profile-footer-link" style={styles.footerCta}>
              Create your{' '}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', verticalAlign: 'middle' }}>
                <Logo size={18} />
                Pingless
              </span>{' '}
              workspace →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
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
  logoText: {
    fontWeight: 700,
    fontSize: '16px',
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
  },

  btnPrimary: {
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: '13px',
    padding: '9px 16px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: 'var(--shadow-accent)',
  },

  body: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '48px var(--space-10) var(--space-20)',
  },
  inner: {
    width: '100%',
    maxWidth: '660px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  headerCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xs)',
    padding: '24px 28px',
    marginBottom: '4px',
  },

  emptyCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xs)',
    padding: '40px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyCardIcon: {
    fontSize: '32px',
  },
  emptyCardText: {
    fontSize: '15px',
    color: 'var(--text-2)',
    fontStyle: 'italic',
    margin: 0,
    maxWidth: '360px',
    lineHeight: 1.55,
    fontFamily: 'var(--font-sans)',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '40px',
  },
  footerTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '13px',
    color: 'var(--text-3)',
    fontWeight: 400,
    fontFamily: 'var(--font-sans)',
  },
  footerDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  footerCta: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--accent)',
    textDecoration: 'none',
    fontFamily: 'var(--font-sans)',
  },

  notFoundWrap: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: 'var(--space-4)',
  },
  notFoundIcon: {
    fontSize: '64px',
    marginBottom: 'var(--space-4)',
    lineHeight: 1,
  },
  notFoundTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '26px',
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    margin: '0 0 8px',
  },
  notFoundSub: {
    fontSize: '15px',
    color: 'var(--text-2)',
    marginBottom: '24px',
    fontFamily: 'var(--font-sans)',
  },
};
