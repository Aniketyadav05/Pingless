import React from 'react';

const surface = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-xs)',
};

export function Card({ padding = '22px 24px', style, className, children }) {
  return (
    <div
      className={className}
      style={{
        ...surface,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
