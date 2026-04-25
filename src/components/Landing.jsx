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
        <div style={styles.header}>
          <span style={{ ...styles.time, color: theme.textDim }}>9:41</span>
          <button onClick={onSettings} style={{ ...styles.iconButton, color: theme.textMuted }} aria-label="Settings">
            <SettingsIcon size={18} strokeWidth={1.5} />
          </button>
        </div>
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
        <div style={styles.settingsRow}>
          <button onClick={onSettings} style={{ ...styles.settingsCard, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font, color: theme.text }}>
            <div style={{ ...styles.settingsCardLabel, color: theme.textDim }}>LIFE</div>
            <div style={{ ...styles.settingsCardValueBig, color: theme.text }}>{startingLife}</div>
          </button>
          <button onClick={onSettings} style={{ ...styles.settingsCard, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font, color: theme.text }}>
            <div style={{ ...styles.settingsCardLabel, color: theme.textDim }}>THEME</div>
            <div style={{ ...styles.settingsCardValueSmall, color: theme.text }}>{theme.name}</div>
          </button>
        </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  time: {
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums'
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex'
  },
  titleSection: {
    textAlign: 'center',
    marginTop: 44
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
  settingsRow: {
    marginTop: 'auto',
    display: 'flex',
    gap: 8,
    marginBottom: 12
  },
  settingsCard: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 8,
    textAlign: 'center',
    cursor: 'pointer'
  },
  settingsCardLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  settingsCardValueBig: {
    fontSize: 18,
    fontWeight: 500
  },
  settingsCardValueSmall: {
    fontSize: 14,
    fontWeight: 500
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
