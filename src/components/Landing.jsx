import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';

export const Landing = ({ theme, playerCount, setPlayerCount, startingLife, onStart, onSettings }) => (
  <div style={{
    position: 'relative', width: '100%', height: '100%',
    padding: '28px 22px', boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column',
    color: theme.text, fontFamily: theme.font, overflow: 'hidden'
  }}>
    <ThemeDecoration theme={theme} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: theme.textDim, fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <button onClick={onSettings} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted, padding: 4, display: 'flex' }} aria-label="Settings">
          <SettingsIcon size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 44 }}>
        <div style={{ fontSize: 30, fontWeight: 500, color: theme.text, letterSpacing: 0.3 }}>MTG Life</div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, fontStyle: theme.name === 'Fantasy' ? 'italic' : 'normal' }}>Commander tracker</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, textAlign: 'center', marginTop: 48, marginBottom: 20, color: theme.text }}>How many players?</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const selected = playerCount === n;
          return (
            <button key={n} onClick={() => setPlayerCount(n)} style={{
              aspectRatio: '1',
              background: selected ? theme.accentBg : theme.surface,
              border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 500,
              color: selected ? theme.accentText : theme.text,
              cursor: 'pointer', transition: 'all 0.15s ease',
              fontFamily: theme.font, padding: 0
            }}>{n}</button>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={onSettings} style={{ flex: 1, padding: '10px 12px', background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer', fontFamily: theme.font, color: theme.text }}>
          <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 0.5, marginBottom: 2 }}>LIFE</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: theme.text }}>{startingLife}</div>
        </button>
        <button onClick={onSettings} style={{ flex: 1, padding: '10px 12px', background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer', fontFamily: theme.font, color: theme.text }}>
          <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 0.5, marginBottom: 2 }}>THEME</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{theme.name}</div>
        </button>
      </div>
      <button onClick={onStart} style={{ background: theme.button, color: theme.buttonText, padding: '14px', borderRadius: 10, textAlign: 'center', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: theme.font }}>Start game</button>
    </div>
  </div>
);
