import React, { useState } from 'react';
import { Undo2, Scale, MoreHorizontal } from 'lucide-react';
import { PlayerPanel } from './PlayerPanel';
import { DeathModal } from './DeathModal';
import { ComingSoonForCount } from './ComingSoonForCount';
import { getLayout } from '../utils/layout';
import { useSettings } from '../context/SettingsContext';
import { useGameEngine } from '../hooks/useGameEngine';

export function GameScreen({ initialPlayers, onEndGame }) {
  const { theme, toggles } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    players,
    displayDeltas,
    pendingPlayer,
    canUndo,
    actions
  } = useGameEngine(initialPlayers, toggles);

  const layout = getLayout(players.length);
  if (!layout) {
    return <ComingSoonForCount count={players.length} onBack={onEndGame} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: theme.bg, padding: 6, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', display: 'grid', gap: 6, ...layout.template }}>
        {players.map((p, idx) => {
          const slot = layout.slots[idx];
          return (
            <PlayerPanel
              key={p.id}
              player={p}
              displayDelta={displayDeltas[p.id]}
              rotated={slot.rotated}
              area={slot.area}
              onLifeTick={(delta) => actions.onLifeTick(p.id, delta)}
              onTryDie={() => actions.tryDie(p.id)}
            />
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: theme.bg, borderRadius: 999, padding: '6px 8px', border: `0.5px solid ${theme.surfaceBorder}`, display: 'flex', gap: 4, alignItems: 'center', zIndex: 10 }}>
        <button
          onClick={actions.undo}
          disabled={!canUndo}
          style={{ background: 'transparent', border: 'none', cursor: !canUndo ? 'not-allowed' : 'pointer', color: theme.textMuted, padding: 7, display: 'flex', opacity: !canUndo ? 0.35 : 1, borderRadius: 999 }}
          aria-label="Undo"
        >
          <Undo2 size={15} strokeWidth={1.75} />
        </button>
        <button
          disabled
          style={{ background: 'transparent', border: 'none', cursor: 'not-allowed', color: theme.textMuted, padding: 7, display: 'flex', opacity: 0.35, borderRadius: 999 }}
          aria-label="AI Judge (coming soon)"
          title="AI Judge — coming soon"
        >
          <Scale size={15} strokeWidth={1.75} />
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted, padding: 7, display: 'flex', borderRadius: 999 }}
          aria-label="Menu"
        >
          <MoreHorizontal size={15} strokeWidth={1.75} />
        </button>
      </div>

      {menuOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 20 }} onClick={() => setMenuOpen(false)}>
          <div style={{ background: theme.bg, borderRadius: 14, padding: 18, width: '100%', border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font, color: theme.text }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Menu</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => { actions.restart(); setMenuOpen(false); }} style={{ background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, padding: 12, fontSize: 13, color: theme.text, cursor: 'pointer', fontFamily: theme.font, textAlign: 'left' }}>
                <div style={{ fontWeight: 500 }}>Restart game</div>
                <div style={{ color: theme.textDim, fontSize: 11, marginTop: 2 }}>Keeps players, resets life</div>
              </button>
              <button onClick={onEndGame} style={{ background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, padding: 12, fontSize: 13, color: theme.text, cursor: 'pointer', fontFamily: theme.font, textAlign: 'left' }}>
                <div style={{ fontWeight: 500 }}>End game</div>
                <div style={{ color: theme.textDim, fontSize: 11, marginTop: 2 }}>Returns to landing page</div>
              </button>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'transparent', border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, padding: 10, fontSize: 13, color: theme.text, cursor: 'pointer', fontFamily: theme.font, marginTop: 4 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <DeathModal player={pendingPlayer} onConfirm={actions.confirmDeath} onCancel={actions.cancelDeath} />
    </div>
  );
}
