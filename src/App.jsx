import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Settings } from './components/Settings';
import { PlayerSetup } from './components/PlayerSetup';
import { GameScreen } from './components/GameScreen';
import { useSettings } from './context/SettingsContext';

export default function App() {
  const { theme, startingLife } = useSettings();
  const [screen, setScreen] = useState('landing');
  const [gamePlayers, setGamePlayers] = useState(null);

  function handleBegin(setupPlayers) {
    const initialized = setupPlayers.map((p) => ({
      ...p,
      life: startingLife,
      poison: 0,
      commanderDamage: {},
      isDead: false
    }));
    setGamePlayers(initialized);
    setScreen('game');
  }

  function endGame() {
    setGamePlayers(null);
    setScreen('landing');
  }

  return (
    <div style={styles.appWrapper}>
      <div style={{ ...styles.appContainer, background: theme.bg }}>
        <div style={styles.appRelative}>
          {screen === 'landing' && (
            <Landing onStart={() => setScreen('player-setup')} onSettings={() => setScreen('settings')} />
          )}
          {screen === 'settings' && (
            <Settings onBack={() => setScreen('landing')} />
          )}
          {screen === 'player-setup' && (
            <PlayerSetup onBack={() => setScreen('landing')} onBegin={handleBegin} />
          )}
          {screen === 'game' && gamePlayers && (
            <GameScreen initialPlayers={gamePlayers} onEndGame={endGame} />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  appWrapper: {
    minHeight: '760px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: '#DAD5CA',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  appContainer: {
    width: 380,
    maxWidth: '100%',
    height: 720,
    borderRadius: 36,
    overflow: 'hidden',
    transition: 'background 0.3s ease',
    border: '1px solid rgba(0,0,0,0.12)'
  },
  appRelative: {
    width: '100%',
    height: '100%',
    position: 'relative'
  }
};
