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

  return (
    <div style={{
      background: theme.surface,
      border: `0.5px solid ${theme.surfaceBorder}`,
      borderLeft: `3px solid ${color.hex}`,
      borderRadius: 8,
      padding: 10,
      marginBottom: 8
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={cycleColor}
          aria-label="Change player color"
          style={{ width: 26, height: 26, borderRadius: '50%', background: color.hex, border: '2px solid rgba(255,255,255,0.6)', cursor: 'pointer', flexShrink: 0, padding: 0 }}
        />
        <input
          type="text"
          value={player.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          maxLength={20}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 14, fontWeight: 500, fontFamily: theme.font, minWidth: 0, padding: '4px 0' }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        {player.commander ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4, background: 'rgba(0,0,0,0.1)', border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 6 }}>
            {player.commander.smallUrl ? (
              <div style={{ width: 26, height: 26, borderRadius: 4, background: `url(${player.commander.smallUrl}) center/cover`, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 26, height: 26, borderRadius: 4, background: color.hex, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 12, color: theme.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.commander.name}</span>
            <button onClick={() => onUpdate({ commander: null, partner: null })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textDim, padding: 2, display: 'flex' }}>
              <X size={12} />
            </button>
          </div>
        ) : searchingSlot === 'commander' ? (
          <CommanderSearch onSelect={(c) => handleSelect('commander', c)} onCancel={() => setSearchingSlot(null)} />
        ) : (
          <button onClick={() => setSearchingSlot('commander')} style={{ background: 'transparent', border: `0.5px dashed ${theme.surfaceBorder}`, color: theme.textMuted, fontSize: 11, padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: theme.font, width: '100%', textAlign: 'left' }}>
            + Add commander
          </button>
        )}
      </div>
      {partnerEnabled && player.commander && (
        <div style={{ marginTop: 6 }}>
          {player.partner ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4, background: 'rgba(0,0,0,0.1)', border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 6 }}>
              {player.partner.smallUrl ? (
                <div style={{ width: 26, height: 26, borderRadius: 4, background: `url(${player.partner.smallUrl}) center/cover`, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 26, height: 26, borderRadius: 4, background: color.hex, flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 12, color: theme.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.partner.name}</span>
              <button onClick={() => onUpdate({ partner: null })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textDim, padding: 2, display: 'flex' }}>
                <X size={12} />
              </button>
            </div>
          ) : searchingSlot === 'partner' ? (
            <CommanderSearch onSelect={(c) => handleSelect('partner', c)} onCancel={() => setSearchingSlot(null)} />
          ) : (
            <button onClick={() => setSearchingSlot('partner')} style={{ background: 'transparent', border: `0.5px dashed ${theme.surfaceBorder}`, color: theme.textMuted, fontSize: 11, padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: theme.font, width: '100%', textAlign: 'left' }}>
              + Add partner commander
            </button>
          )}
        </div>
      )}
    </div>
  );
}
