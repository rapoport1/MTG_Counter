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
    <div style={{ ...styles.container, color: theme.text, fontFamily: theme.font }}>
      <ThemeDecoration theme={theme} />
      <div style={styles.content}>
        <div style={styles.header}>
          <button onClick={onBack} style={{ ...styles.backButton, color: theme.text }} aria-label="Back">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div style={styles.headerTitle}>Players</div>
        </div>
        
        <div style={{ ...styles.helpText, color: theme.textDim }}>
          Tap the color circle to cycle. Commander art is optional and searched live from Scryfall.
        </div>
        
        <div style={styles.listContainer}>
          {players.map((p) => (
            <PlayerSetupRow
              key={p.id}
              player={p}
              onUpdate={(updates) => updatePlayer(p.id, updates)}
            />
          ))}
        </div>
        
        <button onClick={() => onBegin(players)} style={{ ...styles.beginButton, background: theme.button, color: theme.buttonText, fontFamily: theme.font }}>
          Begin game
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '28px 22px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 500
  },
  helpText: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.4
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    marginRight: -8,
    paddingRight: 8
  },
  beginButton: {
    marginTop: 10,
    padding: '14px',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0
  }
};
