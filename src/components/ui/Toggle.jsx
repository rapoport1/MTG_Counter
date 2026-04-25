import React from 'react';

export function Toggle({ checked, onChange, disabled, theme }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        ...styles.toggleContainer,
        background: checked ? (disabled ? theme.surfaceBorder : theme.accent) : theme.surfaceBorder,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      aria-pressed={checked}
    >
      <div style={{
        ...styles.toggleKnob,
        background: theme.bg,
        boxShadow: `0 2px 4px rgba(0,0,0,0.15), 0 0 0 0.5px ${theme.surfaceBorder}`,
        transform: `translateX(${checked ? 20 : 2}px)`
      }} />
    </button>
  );
}

const styles = {
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    position: 'relative',
    border: 'none',
    padding: 0,
    transition: 'background 0.2s ease',
    flexShrink: 0
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 2,
    left: 0,
    transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
  }
};
