import React, { useState, useRef, useEffect } from 'react';
import { Undo2, Scale, MoreHorizontal } from 'lucide-react';
import { PlayerPanel } from './PlayerPanel';
import { DeathModal } from './DeathModal';
import { ComingSoonForCount } from './ComingSoonForCount';
import { getLayout } from '../utils/layout';

const MERGE_WINDOW_MS = 900;
const DISPLAY_LINGER_MS = 1400;

export function GameScreen({ theme, initialPlayers, toggles, onEndGame }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [history, setHistory] = useState([]);
  const [displayDeltas, setDisplayDeltas] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingDeath, setPendingDeath] = useState(null);
  const historyRef = useRef([]);
  const clearTimersRef = useRef({});

  useEffect(() => { historyRef.current = history; }, [history]);

  function scheduleDisplayClear(playerId) {
    if (clearTimersRef.current[playerId]) clearTimeout(clearTimersRef.current[playerId]);
    clearTimersRef.current[playerId] = setTimeout(() => {
      setDisplayDeltas((d) => {
        const n = { ...d };
        delete n[playerId];
        return n;
      });
      delete clearTimersRef.current[playerId];
    }, DISPLAY_LINGER_MS);
  }

  function onLifeTick(playerId, direction) {
    setPlayers((ps) => ps.map((p) => (p.id === playerId ? { ...p, life: Math.max(-99, Math.min(999, p.life + direction)) } : p)));

    const now = Date.now();
    const last = historyRef.current[historyRef.current.length - 1];
    const shouldMerge = last && last.type === 'life' && last.playerId === playerId && (now - last.timestamp) < MERGE_WINDOW_MS;

    let newDelta;
    let newHistory;
    if (shouldMerge) {
      newDelta = last.delta + direction;
      newHistory = [...historyRef.current.slice(0, -1), { ...last, delta: newDelta, timestamp: now }];
    } else {
      newDelta = direction;
      newHistory = [...historyRef.current, { type: 'life', playerId, delta: direction, timestamp: now }].slice(-50);
    }
    historyRef.current = newHistory;
    setHistory(newHistory);

    setDisplayDeltas((d) => ({ ...d, [playerId]: newDelta }));
    scheduleDisplayClear(playerId);

    if (toggles.haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(8); } catch (e) {}
    }
  }

  function tryDie(playerId) {
    setPendingDeath(playerId);
  }

  function confirmDeath() {
    if (pendingDeath == null) return;
    const playerId = pendingDeath;
    const prevLife = players.find((p) => p.id === playerId)?.life ?? 1;
    setPlayers((ps) => ps.map((p) => (p.id === playerId ? { ...p, isDead: true, life: 0 } : p)));
    const newHistory = [...historyRef.current, { type: 'death', playerId, prevLife }].slice(-50);
    historyRef.current = newHistory;
    setHistory(newHistory);
    setPendingDeath(null);

    if (toggles.haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([20, 40, 20]); } catch (e) {}
    }
  }

  function cancelDeath() {
    setPendingDeath(null);
  }

  function undo() {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current[historyRef.current.length - 1];
    if (last.type === 'life') {
      setPlayers((ps) => ps.map((p) => (p.id === last.playerId ? { ...p, life: p.life - last.delta } : p)));
      if (clearTimersRef.current[last.playerId]) clearTimeout(clearTimersRef.current[last.playerId]);
      setDisplayDeltas((d) => ({ ...d, [last.playerId]: -last.delta }));
      clearTimersRef.current[last.playerId] = setTimeout(() => {
        setDisplayDeltas((d) => {
          const n = { ...d };
          delete n[last.playerId];
          return n;
        });
        delete clearTimersRef.current[last.playerId];
      }, 1500);
    } else if (last.type === 'death') {
      setPlayers((ps) => ps.map((p) => (p.id === last.playerId ? { ...p, isDead: false, life: last.prevLife } : p)));
    }
    const newHistory = historyRef.current.slice(0, -1);
    historyRef.current = newHistory;
    setHistory(newHistory);
  }

  function restart() {
    setPlayers(initialPlayers);
    setHistory([]);
    historyRef.current = [];
    setDisplayDeltas({});
    setPendingDeath(null);
    Object.values(clearTimersRef.current).forEach((t) => clearTimeout(t));
    clearTimersRef.current = {};
    setMenuOpen(false);
  }

  const layout = getLayout(players.length);
  if (!layout) {
    return <ComingSoonForCount theme={theme} count={players.length} onBack={onEndGame} />;
  }

  const pendingPlayer = pendingDeath != null ? players.find((p) => p.id === pendingDeath) : null;

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
              onLifeTick={(delta) => onLifeTick(p.id, delta)}
              onTryDie={() => tryDie(p.id)}
              rapidIncrement={toggles.rapidIncrement}
              poisonEnabled={toggles.poisonCounters}
            />
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: theme.bg, borderRadius: 999, padding: '6px 8px', border: `0.5px solid ${theme.surfaceBorder}`, display: 'flex', gap: 4, alignItems: 'center', zIndex: 10 }}>
        <button
          onClick={undo}
          disabled={history.length === 0}
          style={{ background: 'transparent', border: 'none', cursor: history.length === 0 ? 'not-allowed' : 'pointer', color: theme.textMuted, padding: 7, display: 'flex', opacity: history.length === 0 ? 0.35 : 1, borderRadius: 999 }}
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
              <button onClick={restart} style={{ background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, padding: 12, fontSize: 13, color: theme.text, cursor: 'pointer', fontFamily: theme.font, textAlign: 'left' }}>
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

      <DeathModal theme={theme} player={pendingPlayer} onConfirm={confirmDeath} onCancel={cancelDeath} />
    </div>
  );
}
