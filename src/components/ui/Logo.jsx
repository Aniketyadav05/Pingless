import React from 'react';

/**
 * Themed Logo component that uses LogoLightMode.png and LogoDarkMode.png.
 * Switching is handled automatically via CSS variables in index.css
 */
export function Logo({ size = 22, style }) {
  return (
    <div
      aria-label="Pingless"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: 'var(--logo-url)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
