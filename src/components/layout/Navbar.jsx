import React from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';
import { ThemeToggle } from '../ui/ThemeToggle';

const outer = {
  position: 'sticky',
  top: 0,
  zIndex: 200,
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(var(--bg-rgb), 0.92)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--border)',
};

const inner = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 var(--space-10)',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-3)',
  minHeight: '56px',
};

export function Navbar({ logo, actions, style }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease }}
      style={{ ...outer, ...style }}
    >
      <div style={inner}>
        {logo}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {actions}
          <div style={{ marginLeft: '4px', borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
