import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { Toggle } from './ui/Toggle';
import { THEMES } from '../constants/themes';
import { useSettings } from '../context/SettingsContext';

export const Settings = ({ onBack }) => {
  const { theme, themeKey, setThemeKey, startingLife, setStartingLife, toggles, setToggles } = useSettings();

  return (
    <div style={{ ...styles.container, color: theme.text, fontFamily: theme.font }}>
      <ThemeDecoration theme={theme} />
      <div style={styles.content}>
        <div style={styles.header}>
          <button onClick={onBack} style={{ ...styles.backButton, color: theme.text }} aria-label="Back">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div style={styles.headerTitle}>Settings</div>
        </div>
        
        <div style={{ ...styles.sectionLabel, color: theme.textDim }}>THEME</div>
        <div style={styles.grid3}>
          {Object.entries(THEMES).map(([key, t]) => {
            const selected = themeKey === key;
            return (
              <button key={key} onClick={() => setThemeKey(key)} style={{
                ...styles.themeButton,
                background: selected ? theme.accentBg : theme.surface,
                border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
                color: selected ? theme.accentText : theme.text,
                fontFamily: theme.font
              }}>{t.name}</button>
            );
          })}
        </div>

        <div style={{ ...styles.sectionLabel, color: theme.textDim }}>STARTING LIFE</div>
        <div style={styles.grid5}>
          {[20, 30, 40, 50, 60].map((n) => {
            const selected = startingLife === n;
            return (
              <button key={n} onClick={() => setStartingLife(n)} style={{
                ...styles.lifeButton,
                background: selected ? theme.accentBg : theme.surface,
                border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
                color: selected ? theme.accentText : theme.text,
                fontFamily: theme.font
              }}>{n}</button>
            );
          })}
        </div>

        <div style={{ ...styles.sectionLabel, color: theme.textDim, marginBottom: 4 }}>GAME</div>
        <div style={styles.togglesContainer}>
          {[
            { key: 'partnerCommanders', label: 'Partner commanders' },
            { key: 'poisonCounters', label: 'Poison counters' },
            { key: 'rapidIncrement', label: 'Rapid increment on hold' },
            { key: 'keepAwake', label: 'Keep screen awake' },
            { key: 'haptic', label: 'Haptic feedback' }
          ].map(({ key, label }) => (
            <div key={key} style={{ ...styles.toggleRow, borderBottom: `0.5px solid ${theme.surfaceBorder}` }}>
              <span style={{ ...styles.toggleLabel, color: theme.text }}>{label}</span>
              <Toggle theme={theme} checked={toggles[key]} onChange={(v) => setToggles({ ...toggles, [key]: v })} />
            </div>
          ))}
          <div style={styles.toggleRowLast}>
            <div style={styles.toggleTextContainer}>
              <div style={{ ...styles.toggleLabel, color: theme.text }}>AI Judge</div>
              <div style={{ ...styles.toggleSubtext, color: theme.textDim }}>Coming soon · mobile only</div>
            </div>
            <Toggle theme={theme} checked={false} onChange={() => {}} disabled />
          </div>
        </div>

        <div style={{ ...styles.footer, borderTop: `0.5px solid ${theme.surfaceBorder}`, color: theme.textDim }}>
          MTG Life · v4 prototype
        </div>
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
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 500
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 10,
    fontWeight: 500
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    marginBottom: 24
  },
  themeButton: {
    padding: '14px 4px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  grid5: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 6,
    marginBottom: 24
  },
  lifeButton: {
    padding: '12px 2px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  togglesContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0'
  },
  toggleRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0'
  },
  toggleLabel: {
    fontSize: 14,
    flex: 1,
    paddingRight: 12
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 12
  },
  toggleSubtext: {
    fontSize: 11,
    marginTop: 2
  },
  footer: {
    marginTop: 28,
    paddingTop: 20,
    fontSize: 11,
    textAlign: 'center'
  }
};
