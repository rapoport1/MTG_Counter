import React from 'react';
import { Skull } from 'lucide-react';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function DeathModal({ player, onConfirm, onCancel }) {
  const { theme } = useSettings();
  
  if (!player) return null;
  const color = getColor(player.colorId);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 30 }} onClick={onCancel}>
      <div style={{ background: theme.bg, borderRadius: 16, padding: 22, width: '100%', border: `1px solid ${color.border}`, fontFamily: theme.font, color: theme.text, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <Skull size={36} strokeWidth={1.4} style={{ color: theme.danger, marginBottom: 12 }} />
        <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Eliminate {player.name}?</div>
        <div style={{ fontSize: 12, color: theme.textDim, lineHeight: 1.5, marginBottom: 18 }}>
          Player is at 1 life. Confirm elimination, or cancel to keep them in the game. You can undo this if it was a mistake.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={onConfirm} style={{ background: theme.danger, color: 'white', border: 'none', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: theme.font }}>
            Eliminate
          </button>
          <button onClick={onCancel} style={{ background: 'transparent', border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, padding: 10, fontSize: 13, color: theme.text, cursor: 'pointer', fontFamily: theme.font }}>
            Cancel — keep them alive
          </button>
        </div>
      </div>
    </div>
  );
}
