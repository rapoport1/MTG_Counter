import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Settings } from './components/Settings';
import { PlayerSetup } from './components/PlayerSetup';
import { GameScreen } from './components/GameScreen';
import { THEMES } from './constants/themes';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [themeKey, setThemeKey] = useState('simple');
  const [playerCount, setPlayerCount] = useState(4);
  const [startingLife, setStartingLife] = useState(40);
  const [toggles, setToggles] = useState({
    partnerCommanders: true,
    poisonCounters: true,
    rapidIncrement: true,
    keepAwake: true,
    haptic: true
  });
  const [gamePlayers, setGamePlayers] = useState(null);

  const theme = THEMES[themeKey];

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
    <div style={{ minHeight: '760px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#DAD5CA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: 380, maxWidth: '100%', height: 720, background: theme.bg, borderRadius: 36, overflow: 'hidden', transition: 'background 0.3s ease', border: '1px solid rgba(0,0,0,0.12)' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {screen === 'landing' && (
            <Landing
              theme={theme}
              playerCount={playerCount}
              setPlayerCount={setPlayerCount}
              startingLife={startingLife}
              onStart={() => setScreen('player-setup')}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'settings' && (
            <Settings
              theme={theme}
              themeKey={themeKey}
              setThemeKey={setThemeKey}
              startingLife={startingLife}
              setStartingLife={setStartingLife}
              toggles={toggles}
              setToggles={setToggles}
              onBack={() => setScreen('landing')}
            />
          )}
          {screen === 'player-setup' && (
            <PlayerSetup
              theme={theme}
              playerCount={playerCount}
              toggles={toggles}
              onBack={() => setScreen('landing')}
              onBegin={handleBegin}
            />
          )}
          {screen === 'game' && gamePlayers && (
            <GameScreen
              theme={theme}
              initialPlayers={gamePlayers}
              toggles={toggles}
              onEndGame={endGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}
