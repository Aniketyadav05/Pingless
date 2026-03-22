import React from 'react';

export function ProfileHeader({ profile, avail, initials }) {
  const roleLine = [profile.role, profile.company].filter(Boolean).join(' · ');

  return (
    <div className="profile-header-card">
      <div className="ph-row" style={styles.row}>
        <div style={styles.left}>
          <div style={styles.avatarWrap}>
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                style={styles.avatarImg}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={styles.avatarFallback}>{initials}</div>
            )}
            <span
              className={profile.availability === 'available' ? 'avail-dot--pulse' : ''}
              style={{
                ...styles.statusDot,
                background: avail.dot,
                boxShadow: '0 0 0 2px var(--surface)',
              }}
            />
          </div>

          <div style={styles.identity}>
            <h1 style={styles.name}>{profile.displayName}</h1>
            {roleLine ? <p style={styles.role}>{roleLine}</p> : null}
          </div>
        </div>

        <div className="ph-badge" style={styles.badgeWrap}>
          <div
            style={{
              ...styles.availBadge,
              background: avail.bg,
              border: `1px solid ${avail.border}`,
              color: avail.color,
            }}
          >
            <span
              className={profile.availability === 'available' ? 'avail-dot--pulse' : ''}
              style={{ ...styles.availDot, background: avail.dot }}
            />
            {avail.label}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-5)',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-5)',
    flex: '1 1 240px',
    minWidth: 0,
  },
  badgeWrap: {
    marginLeft: 'auto',
    flexShrink: 0,
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    objectFit: 'cover',
    display: 'block',
    border: '1px solid var(--border)',
  },
  avatarFallback: {
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    background: 'var(--bg-soft)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '20px',
    color: 'var(--text-2)',
    border: '1px solid var(--border-mid)',
    fontFamily: 'var(--font-sans)',
  },
  statusDot: {
    position: 'absolute',
    bottom: '-3px',
    right: '-3px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'block',
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: 'var(--font-serif)',
    fontSize: '22px',
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
    margin: '0 0 3px',
    lineHeight: 1.15,
  },
  role: {
    fontSize: '14px',
    fontWeight: 400,
    color: 'var(--text-2)',
    margin: 0,
    fontFamily: 'var(--font-sans)',
  },
  availBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
  },
  availDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
};
