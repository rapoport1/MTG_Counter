import React, { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon,
  ArrowLeft,
  Sparkles,
  Undo2,
  MoreHorizontal,
  Scale,
  X,
  Search
} from 'lucide-react';

// ============ THEMES ============
const THEMES = {
  simple: {
    name: 'Simple',
    bg: '#F5EEDF',
    surface: '#EBDFC4',
    surfaceBorder: '#D9CCB4',
    text: '#3A342C',
    textMuted: '#6B5F4C',
    textDim: '#8B7E6A',
    accent: '#B5603E',
    accentBg: '#F2DBC9',
    accentBorder: '#B5603E',
    accentText: '#6B2C1C',
    button: '#3A342C',
    buttonText: '#F5EEDF',
    toggleInactive: 'rgba(58,52,44,0.22)',
    font: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  },
  space: {
    name: 'Space',
    bg: '#1A1038',
    surface: 'rgba(255,255,255,0.08)',
    surfaceBorder: 'rgba(255,255,255,0.15)',
    text: '#FFFFFF',
    textMuted: '#C5B8E6',
    textDim: '#8A7EB3',
    accent: '#B794F6',
    accentBg: 'rgba(183,148,246,0.2)',
    accentBorder: '#B794F6',
    accentText: '#E4D7FA',
    button: '#B794F6',
    buttonText: '#1A1038',
    toggleInactive: 'rgba(255,255,255,0.18)',
    font: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    decoration: 'stars'
  },
  fantasy: {
    name: 'Fantasy',
    bg: '#2C2E30',
    surface: 'rgba(240,230,210,0.05)',
    surfaceBorder: 'rgba(212,175,55,0.35)',
    text: '#F0E6D2',
    textMuted: '#D4AF37',
    textDim: '#8E8F92',
    accent: '#D4AF37',
    accentBg: 'rgba(212,175,55,0.2)',
    accentBorder: '#D4AF37',
    accentText: '#F5E3A8',
    button: '#D4AF37',
    buttonText: '#2C2E30',
    toggleInactive: 'rgba(240,230,210,0.18)',
    font: 'ui-serif, Georgia, "Times New Roman", serif',
    decoration: 'runes'
  }
};

const PLAYER_COLORS = [
  { id: 'blue',   name: 'Blue',   hex: '#2563eb', light: 'rgba(37,99,235,0.2)',  tint: 'rgba(37,99,235,0.55)',  border: 'rgba(37,99,235,0.5)' },
  { id: 'red',    name: 'Red',    hex: '#dc2626', light: 'rgba(220,38,38,0.2)',  tint: 'rgba(220,38,38,0.55)',  border: 'rgba(220,38,38,0.5)' },
  { id: 'green',  name: 'Green',  hex: '#16a34a', light: 'rgba(22,163,74,0.2)',  tint: 'rgba(22,163,74,0.55)',  border: 'rgba(22,163,74,0.5)' },
  { id: 'purple', name: 'Purple', hex: '#9333ea', light: 'rgba(147,51,234,0.2)', tint: 'rgba(147,51,234,0.55)', border: 'rgba(147,51,234,0.5)' },
  { id: 'amber',  name: 'Amber',  hex: '#d97706', light: 'rgba(217,119,6,0.2)',  tint: 'rgba(217,119,6,0.55)',  border: 'rgba(217,119,6,0.5)' },
  { id: 'pink',   name: 'Pink',   hex: '#db2777', light: 'rgba(219,39,119,0.2)', tint: 'rgba(219,39,119,0.55)', border: 'rgba(219,39,119,0.5)' }
];

function getColor(id) {
  return PLAYER_COLORS.find((c) => c.id === id) || PLAYER_COLORS[0];
}

// Popular commanders (shown by default, and fallback if Scryfall is unreachable)
const POPULAR_COMMANDERS = [
  "Atraxa, Praetors' Voice",
  'Edgar Markov',
  'The Ur-Dragon',
  'Krenko, Mob Boss',
  'Kaalia of the Vast',
  'Meren of Clan Nel Toth',
  'Muldrotha, the Gravetide',
  "Gishath, Sun's Avatar",
  "Yuriko, the Tiger's Shadow",
  'Korvold, Fae-Cursed King',
  'Omnath, Locus of Creation',
  'Niv-Mizzet, Parun',
  'Prossh, Skyraider of Kher',
  'Animar, Soul of Elements',
  'Chulane, Teller of Tales',
  'Derevi, Empyrial Tactician',
  'Talrand, Sky Summoner',
  'Teysa Karlov',
  'Marchesa, the Black Rose',
  'Nekusar, the Mindrazer',
  'Najeela, the Blade-Blossom',
  'Kenrith, the Returned King',
  'Alela, Artful Provocateur',
  'Lathril, Blade of the Elves',
  'Sisay, Weatherlight Captain'
];

const STARS = [
  { x: 14, y: 6, r: 1, op: 0.8 }, { x: 44, y: 4, r: 0.6, op: 0.5 },
  { x: 76, y: 9, r: 1.2, op: 0.9 }, { x: 94, y: 14, r: 0.7, op: 0.6 },
  { x: 16, y: 16, r: 0.5, op: 0.4 }, { x: 56, y: 22, r: 0.9, op: 0.7 },
  { x: 92, y: 28, r: 0.6, op: 0.5 }, { x: 28, y: 36, r: 1, op: 0.7 },
  { x: 84, y: 42, r: 0.5, op: 0.5 }, { x: 50, y: 48, r: 0.8, op: 0.6 },
  { x: 8, y: 54, r: 0.6, op: 0.4 }, { x: 95, y: 58, r: 0.9, op: 0.7 },
  { x: 62, y: 64, r: 0.5, op: 0.5 }, { x: 36, y: 74, r: 0.8, op: 0.6 },
  { x: 90, y: 80, r: 0.6, op: 0.5 }, { x: 20, y: 86, r: 1, op: 0.7 },
  { x: 74, y: 92, r: 0.5, op: 0.4 }, { x: 48, y: 96, r: 0.7, op: 0.6 }
];

// ============ HELPERS ============
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

async function tryFetch(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (e) {
    return null;
  }
}

async function searchScryfall(query) {
  const q = encodeURIComponent(`${query} t:legendary`);
  const res = await tryFetch(
    `https://api.scryfall.com/cards/search?q=${q}&unique=cards&order=edhrec`
  );
  if (!res) return { results: [], error: 'unreachable' };
  if (res.status === 404) return { results: [], error: null };
  if (!res.ok) return { results: [], error: 'api_error' };
  try {
    const data = await res.json();
    const results = (data.data || []).slice(0, 6).map((card) => {
      const face = card.image_uris
        ? card
        : card.card_faces && card.card_faces[0];
      const imgs = face && face.image_uris;
      return {
        id: card.id,
        name: card.name,
        artUrl: (imgs && imgs.art_crop) || null,
        smallUrl: (imgs && imgs.small) || null
      };
    });
    return { results, error: null };
  } catch (e) {
    return { results: [], error: 'parse_error' };
  }
}

function filterPopular(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return POPULAR_COMMANDERS.slice(0, 6).map((name) => ({
      id: `popular:${name}`,
      name,
      artUrl: null,
      smallUrl: null
    }));
  }
  return POPULAR_COMMANDERS.filter((n) => n.toLowerCase().includes(q))
    .slice(0, 6)
    .map((name) => ({ id: `popular:${name}`, name, artUrl: null, smallUrl: null }));
}

function useHoldGesture({ onTrigger, delay = 400, interval = 120, enabled = true }) {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const activeRef = useRef(false);

  const stop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
    activeRef.current = false;
  };

  const start = () => {
    if (activeRef.current) return;
    activeRef.current = true;
    onTrigger();
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          onTrigger();
        }, interval);
      }, delay);
    }
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  return {
    onMouseDown: (e) => { e.preventDefault(); start(); },
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: (e) => { e.preventDefault(); start(); },
    onTouchEnd: stop,
    onTouchCancel: stop
  };
}

// ============ DECORATION ============
const ThemeDecoration = ({ theme }) => {
  if (theme.decoration === 'stars') {
    return (
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op} />
        ))}
      </svg>
    );
  }
  if (theme.decoration === 'runes') {
    return (
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 380 720"
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke={theme.accent} strokeWidth="0.9" fill="none" opacity="0.3">
          <circle cx="340" cy="60" r="14" />
          <line x1="326" y1="60" x2="354" y2="60" />
          <line x1="340" y1="46" x2="340" y2="74" />
        </g>
        <g stroke={theme.accent} strokeWidth="0.9" fill="none" opacity="0.3">
          <path d="M 28 655 L 42 641 L 56 655 L 42 669 Z" />
          <line x1="42" y1="641" x2="42" y2="669" />
        </g>
        <g stroke={theme.accent} strokeWidth="0.7" fill="none" opacity="0.22">
          <path d="M 345 385 L 355 395 L 345 405 L 335 395 Z" />
        </g>
      </svg>
    );
  }
  return null;
};

// ============ TOGGLE ============
const Toggle = ({ theme, checked, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    style={{
      width: 40, height: 22,
      background: checked ? theme.accent : theme.toggleInactive,
      borderRadius: 999, position: 'relative', border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s ease',
      padding: 0, opacity: disabled ? 0.5 : 1, flexShrink: 0
    }}
    aria-checked={checked} role="switch"
  >
    <div style={{
      position: 'absolute', top: 2,
      left: checked ? 20 : 2,
      width: 18, height: 18,
      background: 'white', borderRadius: '50%',
      transition: 'left 0.2s ease'
    }} />
  </button>
);

// ============ LANDING ============
const Landing = ({ theme, playerCount, setPlayerCount, startingLife, onStart, onSettings }) => (
  <div style={{
    position: 'relative', width: '100%', height: '100%',
    padding: '28px 22px', boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column',
    color: theme.text, fontFamily: theme.font, overflow: 'hidden'
  }}>
    <ThemeDecoration theme={theme} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: theme.textDim, fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <button onClick={onSettings} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted, padding: 4, display: 'flex' }} aria-label="Settings">
          <SettingsIcon size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 44 }}>
        <div style={{ fontSize: 30, fontWeight: 500, color: theme.text, letterSpacing: 0.3 }}>MTG Life</div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, fontStyle: theme.name === 'Fantasy' ? 'italic' : 'normal' }}>Commander tracker</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, textAlign: 'center', marginTop: 48, marginBottom: 20, color: theme.text }}>How many players?</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const selected = playerCount === n;
          return (
            <button key={n} onClick={() => setPlayerCount(n)} style={{
              aspectRatio: '1',
              background: selected ? theme.accentBg : theme.surface,
              border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 500,
              color: selected ? theme.accentText : theme.text,
              cursor: 'pointer', transition: 'all 0.15s ease',
              fontFamily: theme.font, padding: 0
            }}>{n}</button>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={onSettings} style={{ flex: 1, padding: '10px 12px', background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer', fontFamily: theme.font, color: theme.text }}>
          <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 0.5, marginBottom: 2 }}>LIFE</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: theme.text }}>{startingLife}</div>
        </button>
        <button onClick={onSettings} style={{ flex: 1, padding: '10px 12px', background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer', fontFamily: theme.font, color: theme.text }}>
          <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 0.5, marginBottom: 2 }}>THEME</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{theme.name}</div>
        </button>
      </div>
      <button onClick={onStart} style={{ background: theme.button, color: theme.buttonText, padding: '14px', borderRadius: 10, textAlign: 'center', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: theme.font }}>Start game</button>
    </div>
  </div>
);

// ============ SETTINGS ============
const Settings = ({ theme, themeKey, setThemeKey, startingLife, setStartingLife, toggles, setToggles, onBack }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <ThemeDecoration theme={theme} />
    <div style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text, padding: 0, display: 'flex' }} aria-label="Back"><ArrowLeft size={20} strokeWidth={1.75} /></button>
        <div style={{ fontSize: 20, fontWeight: 500 }}>Settings</div>
      </div>
      <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 10, fontWeight: 500 }}>THEME</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
        {Object.entries(THEMES).map(([key, t]) => {
          const selected = themeKey === key;
          return (
            <button key={key} onClick={() => setThemeKey(key)} style={{
              padding: '14px 4px',
              background: selected ? theme.accentBg : theme.surface,
              border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
              borderRadius: 8, fontSize: 13,
              color: selected ? theme.accentText : theme.text,
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: theme.font
            }}>{t.name}</button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 10, fontWeight: 500 }}>STARTING LIFE</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 24 }}>
        {[20, 30, 40, 50, 60].map((n) => {
          const selected = startingLife === n;
          return (
            <button key={n} onClick={() => setStartingLife(n)} style={{
              padding: '12px 2px',
              background: selected ? theme.accentBg : theme.surface,
              border: selected ? `2px solid ${theme.accentBorder}` : `0.5px solid ${theme.surfaceBorder}`,
              borderRadius: 8, fontSize: 15, fontWeight: 500,
              color: selected ? theme.accentText : theme.text,
              cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: theme.font
            }}>{n}</button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 1.2, marginBottom: 4, fontWeight: 500 }}>GAME</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { key: 'partnerCommanders', label: 'Partner commanders' },
          { key: 'poisonCounters', label: 'Poison counters' },
          { key: 'rapidIncrement', label: 'Rapid increment on hold' },
          { key: 'keepAwake', label: 'Keep screen awake' },
          { key: 'haptic', label: 'Haptic feedback' }
        ].map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `0.5px solid ${theme.surfaceBorder}` }}>
            <span style={{ fontSize: 14, color: theme.text, flex: 1, paddingRight: 12 }}>{label}</span>
            <Toggle theme={theme} checked={toggles[key]} onChange={(v) => setToggles({ ...toggles, [key]: v })} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ fontSize: 14, color: theme.text }}>AI Judge</div>
            <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>Coming soon · mobile only</div>
          </div>
          <Toggle theme={theme} checked={false} onChange={() => {}} disabled />
        </div>
      </div>
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: `0.5px solid ${theme.surfaceBorder}`, fontSize: 11, color: theme.textDim, textAlign: 'center' }}>MTG Life · v3 prototype</div>
    </div>
  </div>
);

// ============ COMMANDER SEARCH ============
function CommanderSearch({ theme, onSelect, onCancel }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [state, setState] = useState({ results: filterPopular(''), source: 'popular', error: null, loading: false });

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length === 0) {
      setState({ results: filterPopular(''), source: 'popular', error: null, loading: false });
      return;
    }
    if (q.length < 2) {
      setState({ results: [], source: 'empty', error: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    searchScryfall(q).then((result) => {
      if (cancelled) return;
      if (result.results.length > 0) {
        setState({ results: result.results, source: 'api', error: null, loading: false });
      } else {
        // Fallback to filtered popular
        const popular = filterPopular(q);
        setState({
          results: popular,
          source: 'popular',
          error: result.error,
          loading: false
        });
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const showBanner =
    state.source === 'popular' && state.error === 'unreachable' && debouncedQuery.trim().length >= 2;

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`, borderRadius: 6, padding: '6px 10px' }}>
        <Search size={13} strokeWidth={1.5} style={{ color: theme.textDim, flexShrink: 0 }} />
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commanders..."
          autoFocus
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 12, fontFamily: theme.font, minWidth: 0 }}
        />
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textDim, padding: 2, display: 'flex' }}>
          <X size={13} />
        </button>
      </div>

      {state.loading && <div style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', padding: '8px 0' }}>Searching...</div>}

      {!state.loading && showBanner && (
        <div style={{ fontSize: 10, color: theme.textDim, padding: '6px 2px 0' }}>
          Scryfall unreachable — showing popular matches
        </div>
      )}

      {!state.loading && state.source === 'popular' && debouncedQuery.trim().length === 0 && state.results.length > 0 && (
        <div style={{ fontSize: 10, color: theme.textDim, padding: '6px 2px 0', letterSpacing: 0.5 }}>POPULAR COMMANDERS</div>
      )}

      {!state.loading && state.results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, maxHeight: 180, overflowY: 'auto' }}>
          {state.results.map((r) => (
            <button key={r.id} onClick={() => onSelect(r)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: 5,
              background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}`,
              borderRadius: 6, cursor: 'pointer', fontFamily: theme.font, color: theme.text, textAlign: 'left'
            }}>
              {r.smallUrl ? (
                <div style={{ width: 28, height: 28, borderRadius: 4, background: `url(${r.smallUrl}) center/cover`, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: 4, background: `${theme.accentBg}`, border: `0.5px solid ${theme.surfaceBorder}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim, fontSize: 11 }}>?</div>
              )}
              <span style={{ fontSize: 12, flex: 1 }}>{r.name}</span>
            </button>
          ))}
        </div>
      )}

      {!state.loading && state.results.length === 0 && debouncedQuery.trim().length >= 2 && (
        <div style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', padding: '8px 0' }}>No matches</div>
      )}
      {!state.loading && debouncedQuery.trim().length === 1 && (
        <div style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', padding: '8px 0' }}>Keep typing...</div>
      )}
    </div>
  );
}

// ============ PLAYER SETUP ROW ============
function PlayerSetupRow({ theme, player, onUpdate, partnerEnabled }) {
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
          <CommanderSearch theme={theme} onSelect={(c) => handleSelect('commander', c)} onCancel={() => setSearchingSlot(null)} />
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
            <CommanderSearch theme={theme} onSelect={(c) => handleSelect('partner', c)} onCancel={() => setSearchingSlot(null)} />
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

// ============ PLAYER SETUP ============
function PlayerSetup({ theme, playerCount, toggles, onBack, onBegin }) {
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
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <ThemeDecoration theme={theme} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text, padding: 0, display: 'flex' }} aria-label="Back"><ArrowLeft size={20} strokeWidth={1.75} /></button>
          <div style={{ fontSize: 20, fontWeight: 500 }}>Players</div>
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 10, lineHeight: 1.4 }}>
          Tap the color circle to cycle. Commander art is optional and searched live from Scryfall.
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginRight: -8, paddingRight: 8 }}>
          {players.map((p) => (
            <PlayerSetupRow
              key={p.id}
              theme={theme}
              player={p}
              onUpdate={(updates) => updatePlayer(p.id, updates)}
              partnerEnabled={toggles.partnerCommanders}
            />
          ))}
        </div>
        <button onClick={() => onBegin(players)} style={{ marginTop: 10, background: theme.button, color: theme.buttonText, padding: '14px', borderRadius: 10, textAlign: 'center', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: theme.font, flexShrink: 0 }}>Begin game</button>
      </div>
    </div>
  );
}

// ============ PLAYER PANEL ============
function PlayerPanel({ player, displayDelta, rotated, onLifeTick, rapidIncrement, poisonEnabled }) {
  const color = getColor(player.colorId);
  const bgImage = player.commander && player.commander.artUrl;

  const plusHandlers = useHoldGesture({ onTrigger: () => onLifeTick(+1), enabled: rapidIncrement });
  const minusHandlers = useHoldGesture({ onTrigger: () => onLifeTick(-1), enabled: rapidIncrement });

  const panelBg = bgImage
    ? {
        backgroundImage: `linear-gradient(${color.tint}, ${color.tint}), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { background: color.light };

  const textColor = bgImage ? '#FFFFFF' : color.hex;
  const textShadow = bgImage ? '0 2px 6px rgba(0,0,0,0.65)' : 'none';

  const highestCmd = Math.max(0, ...Object.values(player.commanderDamage || {}));

  const hasDelta = displayDelta !== undefined && displayDelta !== 0;
  const deltaColor = displayDelta > 0 ? (bgImage ? '#86EFAC' : '#16A34A') : (bgImage ? '#FCA5A5' : '#B91C1C');

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${color.border}`,
        transform: rotated ? 'rotate(180deg)' : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...panelBg
      }}
    >
      <button
        {...plusHandlers}
        aria-label={`Increase ${player.name} life`}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'transparent', border: 'none', cursor: 'pointer', touchAction: 'manipulation' }}
      />
      <button
        {...minusHandlers}
        aria-label={`Decrease ${player.name} life`}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'transparent', border: 'none', cursor: 'pointer', touchAction: 'manipulation' }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', padding: 8, color: textColor, textShadow }}>
        <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.9, letterSpacing: 0.5, marginBottom: 2, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {player.name}
        </div>
        <div style={{
          height: 22, fontSize: 17, fontWeight: 500,
          color: deltaColor,
          textShadow: bgImage ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
          opacity: hasDelta ? 1 : 0,
          transition: 'opacity 0.2s ease',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {hasDelta ? (displayDelta > 0 ? `+${displayDelta}` : `${displayDelta}`) : '+0'}
        </div>
        <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {player.life}
        </div>
        <div style={{ fontSize: 9, opacity: 0.8, marginTop: 10, letterSpacing: 0.5 }}>
          CMD {highestCmd}{poisonEnabled ? ` · POI ${player.poison || 0}` : ''}
        </div>
      </div>
    </div>
  );
}

// ============ GAME SCREEN ============
// Merge window: any life change for the same player within this many ms merges with the previous history entry.
const MERGE_WINDOW_MS = 900;
// How long the session delta display lingers after the last tick.
const DISPLAY_LINGER_MS = 1400;

function GameScreen({ theme, initialPlayers, toggles, onEndGame }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [history, setHistory] = useState([]);
  const [displayDeltas, setDisplayDeltas] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Every life change runs through here. Merges into the previous history entry
  // if it's from the same player and happened recently — this makes a hold session
  // a single undoable step, and lets the display show a running total.
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

  function undo() {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current[historyRef.current.length - 1];
    if (last.type === 'life') {
      setPlayers((ps) => ps.map((p) => (p.id === last.playerId ? { ...p, life: p.life - last.delta } : p)));
      // Show the reversal briefly.
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
    Object.values(clearTimersRef.current).forEach((t) => clearTimeout(t));
    clearTimersRef.current = {};
    setMenuOpen(false);
  }

  if (players.length !== 4) {
    return <ComingSoonForCount theme={theme} count={players.length} onBack={onEndGame} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: theme.bg, padding: 6, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6 }}>
        {players.map((p, idx) => (
          <PlayerPanel
            key={p.id}
            player={p}
            displayDelta={displayDeltas[p.id]}
            rotated={idx < 2}
            onLifeTick={(delta) => onLifeTick(p.id, delta)}
            rapidIncrement={toggles.rapidIncrement}
            poisonEnabled={toggles.poisonCounters}
          />
        ))}
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
    </div>
  );
}

// ============ COMING SOON ============
function ComingSoonForCount({ theme, count, onBack }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '28px 22px', boxSizing: 'border-box', color: theme.text, fontFamily: theme.font, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>
      <ThemeDecoration theme={theme} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Sparkles size={40} strokeWidth={1.2} style={{ color: theme.accent, marginBottom: 16 }} />
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{count}-player layout</div>
        <div style={{ fontSize: 13, color: theme.textMuted, maxWidth: 260, margin: '0 auto', lineHeight: 1.5 }}>
          The {count}-player arrangement lands in slice 3, alongside the death modal and tombstone state.
        </div>
        <button onClick={onBack} style={{ marginTop: 28, background: 'transparent', color: theme.text, padding: '10px 20px', borderRadius: 8, border: `0.5px solid ${theme.surfaceBorder}`, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: theme.font }}>← Back to landing</button>
      </div>
    </div>
  );
}

// ============ APP ============
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
