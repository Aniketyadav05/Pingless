import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { FIELD_ACCENTS } from '../lib/fieldAccents';

const PREVIEW = [
  { key: 'today', icon: '⚡', label: 'Working on today', text: 'Refactoring auth module, reviewing PR #142' },
  { key: 'thisWeek', icon: '🗓', label: 'In progress this week', text: 'Q3 roadmap planning, onboarding flow redesign' },
  { key: 'shipped', icon: '✦', label: 'Recently shipped', text: 'Dark mode rollout, payment integration v2' },
  { key: 'blocked', icon: '⊘', label: 'Blocked on', text: 'Waiting on design review from Product team' },
];

const HOW = [
  { n: '01', title: 'Sign in with Google', body: 'One click. No forms, no onboarding, no setup wizard.' },
  { n: '02', title: 'Update your status', body: "Fill in what you're doing, shipping, or blocked on. Takes 20 seconds." },
  { n: '03', title: 'Share your link', body: 'Drop pingless.app/you in your Slack bio or email footer. Done.' },
];

const TESTIMONIALS = [
  {
    quote:
      'Pingless killed 90% of our status-check Slack threads overnight. My team actually does deep work now.',
    name: 'Sarah Jenkins',
    role: 'Engineering Manager',
  },
  {
    quote: 'I dropped it in my email signature. People stopped pinging me before noon. Genuinely life-changing.',
    name: 'Marcus Torres',
    role: 'Product Lead',
  },
  {
    quote: '10 seconds to update. 30 minutes saved. The math is embarrassingly good.',
    name: 'Elena Rostova',
    role: 'Senior Designer',
  },
];

const ease = [0.25, 0.1, 0.25, 1];

export default function Landing() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        logo={
          <div style={navLogo}>
            <span style={logoDot} />
            <span style={logoText}>Pingless.</span>
          </div>
        }
        actions={
          <Button variant="secondary" onClick={login}>
            Sign in
          </Button>
        }
      />

      <section style={heroSection}>
        <div className="landing-wrap landing-hero-grid" style={heroGrid}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease, delay: 0.05 }}
            style={{ maxWidth: '480px' }}
          >
            <p style={eyebrow}>Async-first work status</p>
            <h1 style={headline}>
              Your work status,
              <br />
              on <em style={headlineEm}>one</em> link.
            </h1>
            <p style={bodyCopy}>
              Share what you&apos;re working on, what&apos;s blocked, and what you shipped — without anyone having to ask.
            </p>
            <div style={urlChip}>
              <span style={urlMuted}>pingless.app/</span>
              <span style={urlStrong}>yourname</span>
              <span style={cursor} aria-hidden />
            </div>
            <Button variant="cta" onClick={login} style={{ marginBottom: '12px', padding: '13px 24px', fontSize: '14px' }}>
              <GoogleIcon />
              Continue with Google
            </Button>
            <span style={trust}>Free forever · No credit card</span>
          </motion.div>

          <div style={heroCardsGrid}>
            {PREVIEW.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -2 }}
                style={{
                  ...previewCard,
                  marginTop: i === 1 || i === 3 ? 20 : 0,
                }}
              >
                <div style={cardHead}>
                  <span style={iconPill}>{c.icon}</span>
                  <span style={cardLabel}>{c.label}</span>
                </div>
                <div style={neutralLine} />
                <p style={cardText}>{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={sectionPad}>
        <div className="landing-wrap">
          <div style={howHeader}>
            <span style={sectionChip}>How it works</span>
            <span />
          </div>
          <div className="landing-how-row" style={howRow}>
            {HOW.map((h, i) => (
              <motion.div
                key={h.n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, ease, delay: i * 0.07 }}
                style={{
                  ...howItem,
                  borderRight: i < HOW.length - 1 ? '1px solid var(--border)' : 'none',
                  paddingRight: i < HOW.length - 1 ? '40px' : 0,
                }}
              >
                <span style={howNum}>{h.n}</span>
                <h3 style={howTitle}>{h.title}</h3>
                <p style={howBody}>{h.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={{ ...sectionPad, background: 'var(--bg-soft)' }}>
        <div className="landing-wrap">
          <span style={{ ...sectionChip, display: 'block', marginBottom: '8px' }}>What it looks like</span>
          <h2 style={previewTitle}>Your status. Their understanding.</h2>
          <div className="landing-preview-row" style={previewRow}>
            {PREVIEW.map((c, i) => (
              <motion.div
                key={`row-${c.key}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                whileHover={{ y: -2 }}
                style={{ ...previewCardTall, position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: FIELD_ACCENTS[c.key],
                  }}
                />
                <div style={{ paddingLeft: '20px' }}>
                  <div style={cardHead}>
                    <span style={iconPill}>{c.icon}</span>
                    <span style={cardLabel}>{c.label}</span>
                  </div>
                  <div style={neutralLine} />
                  <p style={cardText}>{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={{ ...sectionPad, paddingBottom: '72px' }}>
        <div className="landing-wrap">
          <span style={{ ...sectionChip, display: 'block', marginBottom: '36px' }}>What people say</span>
          <div className="landing-test-grid" style={testGrid}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease, delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                style={{
                  ...tCard,
                  marginTop: i === 1 ? 20 : 0,
                }}
                className="landing-t-card"
              >
                <p style={tQuote}>&ldquo;{t.quote}&rdquo;</p>
                <div style={tAuthor}>
                  <div style={tAvatar}>{t.name[0]}</div>
                  <div>
                    <div style={tName}>{t.name}</div>
                    <div style={tRole}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={ctaSection}>
        <div className="landing-wrap">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease }}
            style={{ maxWidth: '480px' }}
          >
            <h2 style={ctaHead}>Your team shouldn&apos;t have to ask where you are.</h2>
            <p style={ctaBody}>Set up in 60 seconds.</p>
            <Button variant="cta" onClick={login} style={{ marginBottom: '10px', padding: '13px 24px', fontSize: '14px' }}>
              <GoogleIcon />
              Get your Pingless page
            </Button>
            <span style={trust}>Free forever · No credit card</span>
          </motion.div>
        </div>
      </section>

      <footer style={footer}>
        <div className="landing-wrap" style={footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ ...logoDot, width: '7px', height: '7px', background: 'var(--text-3)' }} />
            <span style={{ ...logoText, fontSize: '14px', color: 'var(--text-3)' }}>Pingless.</span>
          </div>
          <span style={footerNote}>Async by design · Free forever</span>
        </div>
      </footer>

      <style>{`
        @keyframes landing-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 767px) {
          .landing-hero-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
          .landing-how-row { flex-direction: column !important; }
          .landing-how-row > div { border-right: none !important; padding-right: 0 !important; padding-bottom: var(--space-4); border-bottom: 1px solid var(--border); }
          .landing-how-row > div:last-child { border-bottom: none; padding-bottom: 0; }
          .landing-test-grid { grid-template-columns: 1fr !important; }
          .landing-t-card { margin-top: 0 !important; }
          .landing-preview-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="rgba(255,255,255,0.95)"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="rgba(255,255,255,0.95)"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="rgba(255,255,255,0.95)"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="rgba(255,255,255,0.95)"
      />
    </svg>
  );
}

const navLogo = { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' };
const logoDot = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: 'var(--accent)',
  display: 'inline-block',
  flexShrink: 0,
};
const logoText = {
  fontWeight: 700,
  fontSize: '16px',
  color: 'var(--text)',
  letterSpacing: '-0.02em',
  fontFamily: 'var(--font-sans)',
};

const heroSection = {
  padding: '80px 0 88px',
};

const heroGrid = {
  display: 'grid',
  gridTemplateColumns: '480px 1fr',
  gap: '64px',
  alignItems: 'start',
};

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '20px',
};

const headline = {
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(40px, 5.5vw, 58px)',
  fontWeight: 400,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  color: 'var(--text)',
  marginBottom: '20px',
};

const headlineEm = { fontStyle: 'italic', fontFamily: 'inherit' };

const bodyCopy = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.68,
  color: 'var(--text-2)',
  maxWidth: '380px',
  marginBottom: '28px',
  fontFamily: 'var(--font-sans)',
};

const urlChip = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'var(--surface)',
  border: '1px solid var(--border-mid)',
  borderRadius: '8px',
  padding: '10px 14px',
  marginBottom: '28px',
  gap: 0,
  width: 'fit-content',
};
const urlMuted = { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-3)' };
const urlStrong = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text)',
};
const cursor = {
  display: 'inline-block',
  width: '1.5px',
  height: '14px',
  background: 'var(--accent)',
  marginLeft: '2px',
  borderRadius: '1px',
  animation: 'landing-blink 1s step-end infinite',
};

const trust = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--text-3)',
  fontFamily: 'var(--font-sans)',
};

const heroCardsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  alignItems: 'start',
};

const previewCard = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-xs)',
  padding: 'var(--space-4) 18px 18px',
  transition: 'transform 140ms var(--ease), border-color 140ms var(--ease), box-shadow 140ms var(--ease)',
};

const previewCardTall = {
  ...previewCard,
  minHeight: '120px',
  padding: 'var(--space-4) 18px 18px',
};

const cardHead = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  marginBottom: '10px',
};

const iconPill = {
  width: '28px',
  height: '28px',
  borderRadius: '7px',
  background: 'var(--bg-soft)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
};

const cardLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--text-3)',
};

const neutralLine = {
  width: '24px',
  height: '1.5px',
  background: 'var(--border-mid)',
  borderRadius: '2px',
  marginBottom: '10px',
};

const cardText = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text)',
  lineHeight: 1.55,
  fontFamily: 'var(--font-sans)',
};

const sectionPad = {
  padding: '64px 0',
};

const howHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
};

const sectionChip = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-3)',
};

const howRow = {
  display: 'flex',
  gap: 0,
};

const howItem = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const howNum = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-3)',
  marginBottom: '12px',
};

const howTitle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text)',
  letterSpacing: '-0.01em',
  marginBottom: '6px',
};

const howBody = {
  fontFamily: 'var(--font-sans)',
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-2)',
  lineHeight: 1.62,
};

const previewTitle = {
  fontFamily: 'var(--font-serif)',
  fontSize: '26px',
  fontWeight: 400,
  color: 'var(--text)',
  marginBottom: '36px',
  letterSpacing: '-0.02em',
};

const previewRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
};

const testGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '14px',
  alignItems: 'start',
};

const tCard = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-xs)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const tQuote = {
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-2)',
  lineHeight: 1.7,
  fontFamily: 'var(--font-sans)',
};

const tAuthor = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderTop: '1px solid var(--border)',
  paddingTop: '14px',
};

const tAvatar = {
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  background: 'var(--bg-soft)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--text-2)',
  fontFamily: 'var(--font-sans)',
};

const tName = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text)',
  fontFamily: 'var(--font-sans)',
  marginBottom: '1px',
};

const tRole = {
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--text-3)',
  fontFamily: 'var(--font-sans)',
};

const ctaSection = {
  padding: '72px 0 80px',
};

const ctaHead = {
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(26px, 3.5vw, 36px)',
  fontWeight: 400,
  lineHeight: 1.12,
  letterSpacing: '-0.015em',
  color: 'var(--text)',
  marginBottom: '14px',
};

const ctaBody = {
  fontSize: '15px',
  color: 'var(--text-2)',
  marginBottom: '24px',
  fontFamily: 'var(--font-sans)',
};

const footer = {
  borderTop: '1px solid var(--border)',
  padding: '20px 0',
};

const footerInner = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 'var(--space-2)',
};

const footerNote = {
  fontSize: '12px',
  color: 'var(--text-3)',
  fontFamily: 'var(--font-sans)',
};
