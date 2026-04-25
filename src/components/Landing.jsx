import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { useSettings } from '../context/SettingsContext';

export const Landing = ({ onStart, onSettings }) => {
  const { theme, playerCount, setPlayerCount, startingLife } = useSettings();

  return (
    <div style={{ ...styles.container, color: theme.text, fontFamily: theme.font }}>
      <ThemeDecoration theme={theme} />
      <div style={styles.content}>

        <div style={styles.titleSection}>
          <div style={{ ...styles.title, color: theme.text }}>MTG Life</div>
          <div style={{ ...styles.subtitle, color: theme.textMuted, fontStyle: theme.name === 'Fantasy' ? 'italic' : 'normal' }}>
            Commander tracker
          </div>
        </div>
        <div style={{ ...styles.prompt, color: theme.text }}>How many players?</div>
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const selected = playerCount === n;
            return (
              <button key={n} onClick={() => setPlayerCount(n)} style={{
                ...styles.gridButton,
                background: selected ? theme.accentBg : theme.surface,
                border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
                color: selected ? theme.accentText : theme.text,
                fontFamily: theme.font
              }}>{n}</button>
            );
          })}
        </div>
        <button onClick={onSettings} style={{ ...styles.settingsButton, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font, color: theme.text }}>
          <SettingsIcon size={18} strokeWidth={2} style={{ marginRight: 12, color: theme.textMuted }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Game Settings</div>
            <div style={{ fontSize: 12, marginTop: 2, color: theme.textDim }}>{startingLife} Life • {theme.name} Theme</div>
          </div>
        </button>
        <button onClick={onStart} style={{ ...styles.startButton, background: theme.button, color: theme.buttonText, fontFamily: theme.font }}>
          Start game
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '28px 22px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  titleSection: {
    textAlign: 'center',
    marginTop: 64
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    letterSpacing: 0.3
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4
  },
  prompt: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 20
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10
  },
  gridButton: {
    aspectRatio: '1',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    padding: 0
  },
  settingsButton: {
    marginTop: 'auto',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: 10,
    cursor: 'pointer',
    border: 'none',
  },
  startButton: {
    padding: '14px',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer'
  }
};
