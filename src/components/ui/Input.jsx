import React from 'react';

export function Input({ className = 'pingless-text-input', id, label, style, containerStyle, ...props }) {
  const input = <input id={id} className={className} style={style} {...props} />;
  if (!label) return input;
  return (
    <div style={containerStyle}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-2)',
          marginBottom: '5px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </label>
      {input}
    </div>
  );
}
