import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { useSettings } from '../context/SettingsContext';

export function ComingSoonForCount({ count, onBack }) {
  const { theme } = useSettings();

  return (
    <div style={{ ...styles.container, color: theme.text, fontFamily: theme.font }}>
      <ThemeDecoration theme={theme} />
      <div style={styles.content}>
        <Sparkles size={40} strokeWidth={1.2} style={{ color: theme.accent, marginBottom: 16 }} />
        <div style={styles.title}>{count}-player layout</div>
        <div style={{ ...styles.description, color: theme.textMuted }}>
          This player count isn't supported yet.
        </div>
        <button onClick={onBack} style={{ ...styles.backButton, color: theme.text, border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font }}>
          ← Back to landing
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '28px 22px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center'
  },
  content: {
    position: 'relative',
    zIndex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    maxWidth: 260,
    margin: '0 auto',
    lineHeight: 1.5
  },
  backButton: {
    marginTop: 28,
    background: 'transparent',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer'
  }
};
