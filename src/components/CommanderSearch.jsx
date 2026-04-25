import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchScryfall, filterPopular } from '../utils/api';

export function CommanderSearch({ theme, onSelect, onCancel }) {
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
        const popular = filterPopular(q);
        setState({ results: popular, source: 'popular', error: result.error, loading: false });
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const showBanner = state.source === 'popular' && state.error === 'unreachable' && debouncedQuery.trim().length >= 2;

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
        <div style={{ fontSize: 10, color: theme.textDim, padding: '6px 2px 0' }}>Scryfall unreachable — showing popular matches</div>
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
