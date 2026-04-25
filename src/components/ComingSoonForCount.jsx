import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeDecoration } from './ui/ThemeDecoration';

export function ComingSoonForCount({ theme, count, onBack }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>
      <ThemeDecoration theme={theme} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Sparkles size={40} strokeWidth={1.2} style={{ color: theme.accent, marginBottom: 16 }} />
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{count}-player layout</div>
        <div style={{ fontSize: 13, color: theme.textMuted, maxWidth: 260, margin: '0 auto', lineHeight: 1.5 }}>
          This player count isn't supported yet.
        </div>
        <button onClick={onBack} style={{ marginTop: 28, background: 'transparent', color: theme.text, padding: '10px 20px', borderRadius: 8, border: `0.5px solid ${theme.surfaceBorder}`, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: theme.font }}>← Back to landing</button>
      </div>
    </div>
  );
}
