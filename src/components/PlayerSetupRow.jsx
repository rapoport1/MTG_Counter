import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PLAYER_COLORS, getColor } from '../constants/players';
import { CommanderSearch } from './CommanderSearch';
import { useSettings } from '../context/SettingsContext';

export function PlayerSetupRow({ player, onUpdate }) {
  const { theme, toggles } = useSettings();
  const partnerEnabled = toggles.partnerCommanders;

  const [searchingSlot, setSearchingSlot] = useState(null);
  const color = getColor(player.colorId);

  function cycleColor() {
    const idx = PLAYER_COLORS.findIndex((c) => c.id === player.colorId);
    const next = PLAYER_COLORS[(idx + 1) % PLAYER_COLORS.length];
    onUpdate({ colorId: next.id });
  }

  function handleSelect(slot, commander) {
    onUpdate({ [slot]: commander });
    setSearchingSlot(null);
  }

  const renderCommanderTag = (commander, slotKey) => (
    <div style={{ ...styles.tagContainer, background: 'rgba(0,0,0,0.1)', border: `0.5px solid ${theme.surfaceBorder}` }}>
      {commander.smallUrl ? (
        <div style={{ ...styles.tagImage, backgroundImage: `url(${commander.smallUrl})` }} />
      ) : (
        <div style={{ ...styles.tagPlaceholder, background: color.hex }} />
      )}
      <span style={{ ...styles.tagName, color: theme.text }}>{commander.name}</span>
      <button onClick={() => {
        if (slotKey === 'commander') {
          onUpdate({ commander: null, partner: null });
        } else {
          onUpdate({ partner: null });
        }
      }} style={{ ...styles.clearButton, color: theme.textDim }}>
        <X size={12} />
      </button>
    </div>
  );

  return (
    <div style={{
      ...styles.rowContainer,
      background: theme.surface,
      border: `0.5px solid ${theme.surfaceBorder}`,
      borderLeft: `3px solid ${color.hex}`
    }}>
      <div style={styles.inputGroup}>
        <button
          onClick={cycleColor}
          aria-label="Change player color"
          style={{ ...styles.colorCycleButton, background: color.hex }}
        />
        <input
          type="text"
          value={player.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          onFocus={(e) => e.target.select()}
          maxLength={20}
          style={{ ...styles.nameInput, color: theme.text, fontFamily: theme.font }}
        />
      </div>
      
      <div style={styles.commanderSection}>
        {player.commander ? (
          renderCommanderTag(player.commander, 'commander')
        ) : searchingSlot === 'commander' ? (
          <CommanderSearch onSelect={(c) => handleSelect('commander', c)} onCancel={() => setSearchingSlot(null)} />
        ) : (
          <button onClick={() => setSearchingSlot('commander')} style={{ ...styles.addButton, border: `0.5px dashed ${theme.surfaceBorder}`, color: theme.textMuted, fontFamily: theme.font }}>
            + Add commander
          </button>
        )}
      </div>

      {partnerEnabled && player.commander && player.commander.hasPartner && (
        <div style={styles.partnerSection}>
          {player.partner ? (
            renderCommanderTag(player.partner, 'partner')
          ) : searchingSlot === 'partner' ? (
            <CommanderSearch onSelect={(c) => handleSelect('partner', c)} onCancel={() => setSearchingSlot(null)} isPartnerSearch={true} />
          ) : (
            <button onClick={() => setSearchingSlot('partner')} style={{ ...styles.addButton, border: `0.5px dashed ${theme.surfaceBorder}`, color: theme.textMuted, fontFamily: theme.font }}>
              + Add partner commander
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  rowContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  inputGroup: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  colorCycleButton: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0
  },
  nameInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 14,
    fontWeight: 500,
    minWidth: 0,
    padding: '4px 0'
  },
  commanderSection: {
    marginTop: 8
  },
  partnerSection: {
    marginTop: 6
  },
  tagContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 4,
    borderRadius: 6
  },
  tagImage: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    flexShrink: 0
  },
  tagPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 4,
    flexShrink: 0
  },
  tagName: {
    fontSize: 12,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    display: 'flex'
  },
  addButton: {
    background: 'transparent',
    fontSize: 11,
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left'
  }
};
