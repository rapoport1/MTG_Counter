import React from 'react';

export const Toggle = ({ theme, checked, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    style={{
      width: 40, height: 22,
      background: checked ? theme.accent : theme.toggleInactive,
      borderRadius: 999, position: 'relative', border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s ease',
      padding: 0, opacity: disabled ? 0.5 : 1, flexShrink: 0
    }}
    aria-checked={checked} role="switch"
  >
    <div style={{
      position: 'absolute', top: 2,
      left: checked ? 20 : 2,
      width: 18, height: 18,
      background: 'white', borderRadius: '50%',
      transition: 'left 0.2s ease'
    }} />
  </button>
);
