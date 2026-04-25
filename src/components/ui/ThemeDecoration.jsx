import React from 'react';

export function ThemeDecoration({ theme }) {
  if (theme.name === 'Simple' || theme.name === 'Dark') return null;

  if (theme.name === 'Neon') {
    return (
      <div style={styles.neonBg}>
        <div style={{ ...styles.neonBlob1, background: theme.accentBg }} />
        <div style={{ ...styles.neonBlob2, background: theme.accentBg }} />
      </div>
    );
  }

  if (theme.name === 'Fantasy') {
    return (
      <div style={{ ...styles.fantasyBg, border: `1px solid ${theme.accentBorder}` }}>
        <div style={{ ...styles.fantasyCorner, top: 0, left: 0, borderBottom: `1px solid ${theme.accentBorder}`, borderRight: `1px solid ${theme.accentBorder}` }} />
        <div style={{ ...styles.fantasyCorner, top: 0, right: 0, borderBottom: `1px solid ${theme.accentBorder}`, borderLeft: `1px solid ${theme.accentBorder}` }} />
        <div style={{ ...styles.fantasyCorner, bottom: 0, left: 0, borderTop: `1px solid ${theme.accentBorder}`, borderRight: `1px solid ${theme.accentBorder}` }} />
        <div style={{ ...styles.fantasyCorner, bottom: 0, right: 0, borderTop: `1px solid ${theme.accentBorder}`, borderLeft: `1px solid ${theme.accentBorder}` }} />
      </div>
    );
  }

  return null;
}

const styles = {
  neonBg: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: 0.15
  },
  neonBlob1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '60%',
    height: '40%',
    borderRadius: '50%',
    filter: 'blur(40px)'
  },
  neonBlob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    filter: 'blur(50px)'
  },
  fantasyBg: {
    position: 'absolute',
    inset: 8,
    pointerEvents: 'none',
    opacity: 0.3
  },
  fantasyCorner: {
    position: 'absolute',
    width: 20,
    height: 20
  }
};
