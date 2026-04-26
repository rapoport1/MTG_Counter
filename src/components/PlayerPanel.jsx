import React, { useState, useEffect } from 'react';
import { Skull, X } from 'lucide-react';
import { useHoldGesture } from '../hooks/useHoldGesture';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function PlayerPanel({ player, displayDelta, rotated, onLifeTick, onTryDie, area, onPoisonTick, onCommanderDamageTick, allPlayers }) {
  const { toggles } = useSettings();
  const [isEditingStats, setIsEditingStats] = useState(false);
  const opponents = allPlayers.filter(p => p.id !== player.id);
  const rapidIncrement = toggles.rapidIncrement;
  const poisonEnabled = toggles.poisonCounters;

  const color = getColor(player.colorId);
  const bgImage = player.commander && player.commander.artUrl;

  const plusHandlers = useHoldGesture({
    onTrigger: () => { if (!player.isDead && !isEditingStats) onLifeTick(+1); },
    enabled: rapidIncrement && !player.isDead && !isEditingStats
  });
  const minusHandlers = useHoldGesture({
    onTrigger: () => {
      if (player.isDead || isEditingStats) return;
      if (player.life <= 1) {
        onTryDie();
        return;
      }
      onLifeTick(-1);
    },
    enabled: rapidIncrement && !player.isDead && !isEditingStats && player.life > 1
  });

  const panelBg = bgImage
    ? {
        backgroundImage: `linear-gradient(${color.tint}, ${color.tint}), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { background: color.light };

  const isDead = player.isDead;
  const lowGentle = !isDead && player.life > 4 && player.life <= 9;
  const lowUrgent = !isDead && player.life <= 4 && player.life > 0;

  useEffect(() => {
    if (isDead) {
      setIsEditingStats(false);
    }
  }, [isDead]);

  const textColor = isDead ? 'rgba(255,255,255,0.5)' : (bgImage ? '#FFFFFF' : color.hex);
  const textShadow = bgImage ? '0 2px 6px rgba(0,0,0,0.65)' : 'none';

  const highestCmd = Math.max(0, ...Object.values(player.commanderDamage || {}));

  const hasDelta = !isDead && displayDelta !== undefined && displayDelta !== 0;
  const deltaColor = displayDelta > 0 ? (bgImage ? '#86EFAC' : '#16A34A') : (bgImage ? '#FCA5A5' : '#B91C1C');

  const pulseAnim = lowUrgent
    ? 'mtg-pulse-urgent 1s ease-in-out infinite'
    : lowGentle
    ? 'mtg-pulse-gentle 1.6s ease-in-out infinite'
    : 'none';

  return (
    <div
      style={{
        ...styles.container,
        transform: rotated ? (typeof rotated === 'number' ? `rotate(${rotated}deg)` : 'rotate(180deg)') : 'none',
        transform: rotated ? 'rotate(180deg)' : 'none',
        filter: isDead ? 'grayscale(0.85) brightness(0.55)' : 'none',
        animation: pulseAnim,
        gridArea: area,
        ...panelBg
      }}
    >
      {!isDead && !isEditingStats && (
        <>
          <button
            {...plusHandlers}
            aria-label={`Increase ${player.name} life`}
            style={styles.tapAreaTop}
          />
          <button
            {...minusHandlers}
            aria-label={`Decrease ${player.name} life`}
            style={styles.tapAreaBottom}
          />
        </>
      )}

      {isEditingStats ? (
        <div style={{ ...styles.statsEditor, background: 'rgba(0,0,0,0.85)' }}>
          <button onClick={() => setIsEditingStats(false)} style={styles.closeBtn}>
            <X size={20} color="white" />
          </button>
          <div style={styles.statsScroll}>
            {poisonEnabled && (
              <>
                <div style={styles.editorTitle}>Poison Counters</div>
                <div style={styles.statRow}>
                  <div style={{ ...styles.colorDot, background: '#10b981' }} />
                  <div style={styles.statLabel}>Poison</div>
                  <div style={styles.statControls}>
                    <button onClick={() => onPoisonTick(-1)} style={styles.statBtn}>-</button>
                    <div style={styles.statValue}>{player.poison || 0}</div>
                    <button onClick={() => onPoisonTick(1)} style={styles.statBtn}>+</button>
                  </div>
                </div>
              </>
            )}

            <div style={{ ...styles.editorTitle, marginTop: 12 }}>Commander Damage</div>
            {opponents.flatMap(opp => {
              const rows = [];
              rows.push({
                key: opp.id.toString(),
                label: opp.commander ? opp.commander.name : `${opp.name}'s CMD`,
                isPartner: false,
                oppId: opp.id,
                colorId: opp.colorId
              });
              if (opp.partner) {
                rows.push({
                  key: `${opp.id}_partner`,
                  label: opp.partner.name,
                  isPartner: true,
                  oppId: opp.id,
                  colorId: opp.colorId
                });
              }
              return rows;
            }).map(row => (
              <div key={row.key} style={styles.statRow}>
                <div style={{ ...styles.colorDot, background: getColor(row.colorId).hex }} />
                <div style={styles.statLabel}>{row.label}</div>
                <div style={styles.statControls}>
                  <button onClick={() => onCommanderDamageTick(row.oppId, row.isPartner, -1)} style={styles.statBtn}>-</button>
                  <div style={styles.statValue}>{(player.commanderDamage && player.commanderDamage[row.key]) || 0}</div>
                  <button onClick={() => onCommanderDamageTick(row.oppId, row.isPartner, 1)} style={styles.statBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ ...styles.content, color: textColor, textShadow }}>
          <div style={styles.playerName}>
          {player.name}
        </div>
        
        {isDead ? (
          <>
            <Skull size={42} strokeWidth={1.4} style={styles.skull} />
            <div style={styles.eliminatedText}>ELIMINATED</div>
          </>
        ) : (
          <>
            <div style={{
              ...styles.deltaText,
              color: deltaColor,
              textShadow: bgImage ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
              opacity: hasDelta ? 1 : 0
            }}>
              {hasDelta ? (displayDelta > 0 ? `+${displayDelta}` : `${displayDelta}`) : '+0'}
            </div>
            <div style={styles.lifeText}>
              {player.life}
            </div>
            <button onClick={() => !isDead && setIsEditingStats(true)} style={{ ...styles.statsText, pointerEvents: 'auto', background: 'transparent', border: 'none', color: 'inherit', zIndex: 10, cursor: 'pointer' }}>
              CMD {highestCmd}{poisonEnabled ? ` · POI ${player.poison || 0}` : ''}
            </button>
          </>
        )}
      </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    transition: 'filter 0.4s ease'
  },
  tapAreaTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    zIndex: 2
  },
  tapAreaBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    zIndex: 2
  },
  content: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    padding: 8,
    zIndex: 3
  },
  playerName: {
    fontSize: 11,
    fontWeight: 500,
    opacity: 0.9,
    letterSpacing: 0.5,
    marginBottom: 2,
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  skull: {
    marginTop: 6,
    marginBottom: 6,
    opacity: 0.7
  },
  eliminatedText: {
    fontSize: 10,
    opacity: 0.55,
    letterSpacing: 1.4
  },
  deltaText: {
    height: 22,
    fontSize: 17,
    fontWeight: 500,
    transition: 'opacity 0.2s ease',
    fontVariantNumeric: 'tabular-nums'
  },
  lifeText: {
    fontSize: 64,
    fontWeight: 500,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums'
  },
  statsText: {
    fontSize: 9,
    opacity: 0.8,
    marginTop: 10,
    letterSpacing: 0.5,
    fontFamily: 'inherit'
  },
  statsEditor: { position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 15, padding: 8, background: 'transparent', border: 'none', cursor: 'pointer' },
  statsScroll: { paddingTop: 20, paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', height: '100%' },
  editorTitle: { color: 'white', fontSize: 16, fontWeight: 500, marginBottom: 20 },
  statRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16, padding: '0 12px', boxSizing: 'border-box' },
  colorDot: { width: 14, height: 14, borderRadius: 7, margin: '0 3px' },
  statLabel: { color: 'white', fontSize: 14, flex: 1, marginLeft: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statControls: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 },
  statBtn: { background: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20 },
  statValue: { color: 'white', fontSize: 20, fontWeight: 500, width: 30, textAlign: 'center' }
};
