import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { Toggle } from './ui/Toggle';
import { THEMES } from '../constants/themes';
import { useSettings } from '../context/SettingsContext';

export const Settings = ({ onBack }) => {
  const { theme, themeKey, setThemeKey, startingLife, setStartingLife, toggles, setToggles } = useSettings();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <ThemeDecoration theme={theme} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text, padding: 0, display: 'flex' }} aria-label="Back"><ArrowLeft size={20} strokeWidth={1.75} /></button>
          <div style={{ fontSize: 20, fontWeight: 500 }}>Settings</div>
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 10, fontWeight: 500 }}>THEME</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
          {Object.entries(THEMES).map(([key, t]) => {
            const selected = themeKey === key;
            return (
              <button key={key} onClick={() => setThemeKey(key)} style={{
                padding: '14px 4px',
                background: selected ? theme.accentBg : theme.surface,
                border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
                borderRadius: 8, fontSize: 13,
                color: selected ? theme.accentText : theme.text,
                fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: theme.font
              }}>{t.name}</button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 10, fontWeight: 500 }}>STARTING LIFE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 24 }}>
          {[20, 30, 40, 50, 60].map((n) => {
            const selected = startingLife === n;
            return (
              <button key={n} onClick={() => setStartingLife(n)} style={{
                padding: '12px 2px',
                background: selected ? theme.accentBg : theme.surface,
                border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
                borderRadius: 8, fontSize: 15, fontWeight: 500,
                color: selected ? theme.accentText : theme.text,
                cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: theme.font
              }}>{n}</button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 4, fontWeight: 500 }}>GAME</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { key: 'partnerCommanders', label: 'Partner commanders' },
            { key: 'poisonCounters', label: 'Poison counters' },
            { key: 'rapidIncrement', label: 'Rapid increment on hold' },
            { key: 'keepAwake', label: 'Keep screen awake' },
            { key: 'haptic', label: 'Haptic feedback' }
          ].map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `0.5px solid ${theme.surfaceBorder}` }}>
              <span style={{ fontSize: 14, color: theme.text, flex: 1, paddingRight: 12 }}>{label}</span>
              <Toggle theme={theme} checked={toggles[key]} onChange={(v) => setToggles({ ...toggles, [key]: v })} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <div style={{ fontSize: 14, color: theme.text }}>AI Judge</div>
              <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>Coming soon · mobile only</div>
            </div>
            <Toggle theme={theme} checked={false} onChange={() => {}} disabled />
          </div>
        </div>
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `0.5px solid ${theme.surfaceBorder}`, fontSize: 11, color: theme.textDim, textAlign: 'center' }}>MTG Life · v4 prototype</div>
      </div>
    </div>
  );
};
