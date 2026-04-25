import React from 'react';
import { Skull } from 'lucide-react';
import { useHoldGesture } from '../hooks/useHoldGesture';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function PlayerPanel({ player, displayDelta, rotated, onLifeTick, onTryDie, area }) {
  const { toggles } = useSettings();
  const rapidIncrement = toggles.rapidIncrement;
  const poisonEnabled = toggles.poisonCounters;

  const color = getColor(player.colorId);
  const bgImage = player.commander && player.commander.artUrl;

  const plusHandlers = useHoldGesture({
    onTrigger: () => { if (!player.isDead) onLifeTick(+1); },
    enabled: rapidIncrement && !player.isDead
  });
  const minusHandlers = useHoldGesture({
    onTrigger: () => {
      if (player.isDead) return;
      if (player.life <= 1) {
        onTryDie();
        return;
      }
      onLifeTick(-1);
    },
    enabled: rapidIncrement && !player.isDead && player.life > 1
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
        border: `1px solid ${color.border}`,
        transform: rotated ? 'rotate(180deg)' : 'none',
        filter: isDead ? 'grayscale(0.85) brightness(0.55)' : 'none',
        animation: pulseAnim,
        gridArea: area,
        ...panelBg
      }}
    >
      {!isDead && (
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
            <div style={styles.statsText}>
              CMD {highestCmd}{poisonEnabled ? ` · POI ${player.poison || 0}` : ''}
            </div>
          </>
        )}
      </div>
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
    letterSpacing: 0.5
  }
};
