import React from 'react';
import { motion } from 'framer-motion';
import { micro } from '../../lib/motion';

function Spinner({ size = 14 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="14 32"
        opacity={0.9}
      />
    </motion.svg>
  );
}

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '7px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: '13px',
  borderRadius: 'var(--radius-sm)',
  fontFeatureSettings: '"liga" 1',
  transition: 'transform 140ms var(--ease), background 140ms var(--ease), box-shadow 140ms var(--ease), border-color 140ms var(--ease)',
};

const variants = {
  primary: {
    ...base,
    background: 'var(--accent)',
    color: '#fff',
    padding: '9px 16px',
    border: 'none',
    boxShadow: 'var(--shadow-accent)',
  },
  secondary: {
    ...base,
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border-mid)',
    padding: '9px 16px',
    boxShadow: 'none',
  },
  ghost: {
    ...base,
    background: 'transparent',
    color: 'var(--text-2)',
    border: 'none',
    padding: '8px 10px',
    fontWeight: 500,
    boxShadow: 'none',
  },
  nav: {
    ...base,
    background: 'var(--surface)',
    border: '1px solid var(--border-mid)',
    color: 'var(--text)',
    padding: '9px 16px',
    boxShadow: 'none',
  },
  cta: {
    ...base,
    background: 'var(--accent)',
    color: '#FFFFFF',
    padding: '13px 24px',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    boxShadow: 'var(--shadow-accent-lg)',
  },
};

export function Button({
  variant = 'secondary',
  loading = false,
  disabled,
  fullWidth,
  style,
  children,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;
  const styleVariant = variants[variant] || variants.secondary;

  const hoverY =
    variant === 'ghost' ? 0 : variant === 'primary' || variant === 'cta' ? -1 : -1;

  return (
    <motion.button
      type={type}
      data-pingless-variant={variant}
      disabled={isDisabled}
      whileHover={
        isDisabled
          ? {}
          : {
              y: hoverY,
              transition: { duration: micro.duration, ease: micro.ease },
            }
      }
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1, ease: micro.ease }}
      style={{
        ...styleVariant,
        width: fullWidth ? '100%' : undefined,
        justifyContent: fullWidth ? 'center' : undefined,
        opacity: loading ? 0.88 : isDisabled && variant !== 'ghost' ? 0.6 : 1,
        cursor: loading ? 'wait' : isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {loading && <Spinner size={variant === 'primary' || variant === 'cta' ? 15 : 14} />}
      {children}
    </motion.button>
  );
}
