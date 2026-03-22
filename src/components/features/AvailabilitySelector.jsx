import React from 'react';
import { motion } from 'framer-motion';
import { micro } from '../../lib/motion';
import { AVAILABILITY_OPTIONS } from '../../lib/availability';

const availPreview = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  padding: '5px 12px',
  borderRadius: 'var(--radius-full)',
  marginBottom: '14px',
};

const availGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'var(--space-2)',
};

const availBtnBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: '9px 14px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  transition: 'background 140ms var(--ease), border-color 140ms var(--ease)',
  textAlign: 'left',
  fontWeight: 500,
};

const availBtnDot = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  display: 'inline-block',
  flexShrink: 0,
};

export function AvailabilitySelector({ value, onChange }) {
  const active = AVAILABILITY_OPTIONS.find((a) => a.key === value) || AVAILABILITY_OPTIONS[0];

  return (
    <>
      <div
        style={{
          ...availPreview,
          background: active.bg,
          border: `1px solid ${active.border}`,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
            background: active.dot,
          }}
        />
        <span style={{ fontSize: '12px', fontWeight: 600, color: active.color, fontFamily: 'var(--font-sans)' }}>
          {active.label}
        </span>
      </div>

      <div style={availGrid}>
        {AVAILABILITY_OPTIONS.map((a) => {
          const isActive = value === a.key;
          return (
            <motion.button
              key={a.key}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: micro.duration, ease: micro.ease }}
              onClick={() => onChange(a.key)}
              style={{
                ...availBtnBase,
                background: isActive ? a.bg : 'var(--bg)',
                border: `1px solid ${isActive ? a.border : 'var(--border-mid)'}`,
                color: isActive ? a.color : 'var(--text-2)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <span
                style={{
                  ...availBtnDot,
                  background: a.dot,
                  opacity: isActive ? 1 : 0.3,
                }}
              />
              {a.label}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
