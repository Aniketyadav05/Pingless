import React from 'react';
import { motion } from 'framer-motion';

export function Loader({ message = 'Loading…' }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        background: 'var(--bg)',
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: 'easeInOut',
        }}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent)',
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--text-3)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {message}
      </span>
    </div>
  );
}
