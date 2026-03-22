import React from 'react';

export function SectionHeader({ label }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-3)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {label}
    </p>
  );
}
