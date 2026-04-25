import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PLAYER_COLORS } from '../constants/players';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { PlayerSetupRow } from './PlayerSetupRow';
import { useSettings } from '../context/SettingsContext';

export function PlayerSetup({ onBack, onBegin }) {
  const { theme, playerCount } = useSettings();

  const [players, setPlayers] = useState(() =>
    Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      colorId: PLAYER_COLORS[i % PLAYER_COLORS.length].id,
      commander: null,
      partner: null
    }))
  );

  function updatePlayer(id, updates) {
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <ThemeDecoration theme={theme} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text, padding: 0, display: 'flex' }} aria-label="Back"><ArrowLeft size={20} strokeWidth={1.75} /></button>
          <div style={{ fontSize: 20, fontWeight: 500 }}>Players</div>
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 10, lineHeight: 1.4 }}>
          Tap the color circle to cycle. Commander art is optional and searched live from Scryfall.
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginRight: -8, paddingRight: 8 }}>
          {players.map((p) => (
            <PlayerSetupRow
              key={p.id}
              player={p}
              onUpdate={(updates) => updatePlayer(p.id, updates)}
            />
          ))}
        </div>
        <button onClick={() => onBegin(players)} style={{ marginTop: 10, background: theme.button, color: theme.buttonText, padding: '14px', borderRadius: 10, textAlign: 'center', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: theme.font, flexShrink: 0 }}>Begin game</button>
      </div>
    </div>
  );
}
