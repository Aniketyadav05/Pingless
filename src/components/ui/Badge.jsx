import React from 'react';

export function Badge({ children, style }) {
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-3)',
        letterSpacing: '0.02em',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
