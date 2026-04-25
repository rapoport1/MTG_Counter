import React from 'react';
import { Skull } from 'lucide-react';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function DeathModal({ player, onConfirm, onCancel }) {
  const { theme } = useSettings();
  
  if (!player) return null;
  const color = getColor(player.colorId);

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={{ ...styles.modal, background: theme.bg, border: `1px solid ${color.border}`, fontFamily: theme.font, color: theme.text }} onClick={(e) => e.stopPropagation()}>
        <Skull size={36} strokeWidth={1.4} style={{ color: theme.danger, marginBottom: 12 }} />
        <div style={styles.title}>Eliminate {player.name}?</div>
        <div style={{ ...styles.description, color: theme.textDim }}>
          Player is at 1 life. Confirm elimination, or cancel to keep them in the game. You can undo this if it was a mistake.
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={onConfirm} style={{ ...styles.confirmButton, background: theme.danger, fontFamily: theme.font }}>
            Eliminate
          </button>
          <button onClick={onCancel} style={{ ...styles.cancelButton, border: `0.5px solid ${theme.surfaceBorder}`, color: theme.text, fontFamily: theme.font }}>
            Cancel — keep them alive
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 30
  },
  modal: {
    borderRadius: 16,
    padding: 22,
    width: '100%',
    textAlign: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: 500,
    marginBottom: 6
  },
  description: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 18
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  confirmButton: {
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer'
  },
  cancelButton: {
    background: 'transparent',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    cursor: 'pointer'
  }
};
