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
    <div style={{ ...styles.container, background: theme.bg }}>
      <div style={{ ...styles.grid, ...layout.template }}>
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
              onPoisonTick={(delta) => actions.onPoisonTick(p.id, delta)}
              onCommanderDamageTick={(sourceId, isPartner, delta) => actions.onCommanderDamageTick(p.id, sourceId, isPartner, delta)}
              onTryDie={() => actions.tryDie(p.id)}
              allPlayers={players}
            />
          );
        })}
      </div>

      <div style={{ ...styles.centerMenuWrapper, pointerEvents: 'none', ...(players.length === 1 ? { justifyContent: 'flex-end', paddingBottom: 60 } : {}) }}>
        <div style={{ ...styles.centerMenu, background: theme.bg, border: `0.5px solid ${theme.surfaceBorder}`, pointerEvents: 'auto' }}>
          <button
            onClick={actions.undo}
            disabled={!canUndo}
            style={{
              ...styles.iconButton,
              color: theme.textMuted,
              cursor: !canUndo ? 'not-allowed' : 'pointer',
              opacity: !canUndo ? 0.35 : 1
            }}
            aria-label="Undo"
          >
            <Undo2 size={15} strokeWidth={1.75} />
          </button>
          <button
            disabled
            style={{
              ...styles.iconButton,
              color: theme.textMuted,
              cursor: 'not-allowed',
              opacity: 0.35
            }}
            aria-label="AI Judge (coming soon)"
            title="AI Judge — coming soon"
          >
            <Scale size={15} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            style={{ ...styles.iconButton, color: theme.textMuted, cursor: 'pointer' }}
            aria-label="Menu"
          >
            <MoreHorizontal size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={styles.modalOverlay} onClick={() => setMenuOpen(false)}>
          <div style={{ ...styles.menuContainer, background: theme.bg, border: `0.5px solid ${theme.surfaceBorder}`, fontFamily: theme.font, color: theme.text }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.menuTitle}>Menu</div>
            <div style={styles.menuItems}>
              <button onClick={() => { actions.restart(); setMenuOpen(false); }} style={{ ...styles.menuButton, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, color: theme.text, fontFamily: theme.font }}>
                <div style={styles.menuButtonTitle}>Restart game</div>
                <div style={{ ...styles.menuButtonSub, color: theme.textDim }}>Keeps players, resets life</div>
              </button>
              <button onClick={onEndGame} style={{ ...styles.menuButton, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, color: theme.text, fontFamily: theme.font }}>
                <div style={styles.menuButtonTitle}>End game</div>
                <div style={{ ...styles.menuButtonSub, color: theme.textDim }}>Returns to landing page</div>
              </button>
              <button onClick={() => setMenuOpen(false)} style={{ ...styles.cancelButton, border: `0.5px solid ${theme.surfaceBorder}`, color: theme.text, fontFamily: theme.font }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DeathModal player={pendingPlayer} onConfirm={actions.confirmDeath} onCancel={actions.cancelDeath} />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 6,
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  grid: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gap: 6
  },
  centerMenuWrapper: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 10
  },
  centerMenu: {
    borderRadius: 999,
    padding: '6px 8px',
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    pointerEvents: 'auto'
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    padding: 7,
    display: 'flex',
    borderRadius: 999
  },
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 20
  },
  menuContainer: {
    borderRadius: 14,
    padding: 18,
    width: '100%'
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 12
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  menuButton: {
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left'
  },
  menuButtonTitle: {
    fontWeight: 500
  },
  menuButtonSub: {
    fontSize: 11,
    marginTop: 2
  },
  cancelButton: {
    background: 'transparent',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    cursor: 'pointer',
    marginTop: 4
  }
};
