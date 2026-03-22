import React from 'react';

/**
 * Page section with optional eyebrow — used on Landing for vertical rhythm.
 */
export function Section({
  eyebrow,
  eyebrowStyle,
  children,
  style,
  innerStyle,
  maxWidth = '1100px',
}) {
  return (
    <section style={style}>
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          width: '100%',
          ...innerStyle,
        }}
      >
        {eyebrow && (
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 'var(--space-4)',
              ...eyebrowStyle,
            }}
          >
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
