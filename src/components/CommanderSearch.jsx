import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchScryfall, filterPopular } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export function CommanderSearch({ onSelect, onCancel }) {
  const { theme } = useSettings();
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
    <div style={styles.container}>
      <div style={{ ...styles.inputWrapper, background: theme.surface, border: `0.5px solid ${theme.surfaceBorder}` }}>
        <Search size={13} strokeWidth={1.5} style={{ ...styles.searchIcon, color: theme.textDim }} />
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commanders..."
          autoFocus
          style={{ ...styles.input, color: theme.text, fontFamily: theme.font }}
        />
        <button onClick={onCancel} style={{ ...styles.cancelButton, color: theme.textDim }}>
          <X size={13} />
        </button>
      </div>

      {state.loading && <div style={{ ...styles.message, color: theme.textDim }}>Searching...</div>}
      
      {!state.loading && showBanner && (
        <div style={{ ...styles.banner, color: theme.textDim }}>Scryfall unreachable — showing popular matches</div>
      )}
      
      {!state.loading && state.source === 'popular' && debouncedQuery.trim().length === 0 && state.results.length > 0 && (
        <div style={{ ...styles.popularLabel, color: theme.textDim }}>POPULAR COMMANDERS</div>
      )}
      
      {!state.loading && state.results.length > 0 && (
        <div style={styles.resultsList}>
          {state.results.map((r) => (
            <button key={r.id} onClick={() => onSelect(r)} style={{
              ...styles.resultButton,
              background: theme.surface,
              border: `0.5px solid ${theme.surfaceBorder}`,
              fontFamily: theme.font,
              color: theme.text
            }}>
              {r.smallUrl ? (
                <div style={{ ...styles.resultImage, backgroundImage: `url(${r.smallUrl})` }} />
              ) : (
                <div style={{ ...styles.resultImagePlaceholder, background: theme.accentBg, border: `0.5px solid ${theme.surfaceBorder}`, color: theme.textDim }}>?</div>
              )}
              <span style={styles.resultName}>{r.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {!state.loading && state.results.length === 0 && debouncedQuery.trim().length >= 2 && (
        <div style={{ ...styles.message, color: theme.textDim }}>No matches</div>
      )}
      
      {!state.loading && debouncedQuery.trim().length === 1 && (
        <div style={{ ...styles.message, color: theme.textDim }}>Keep typing...</div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '4px 0'
  },
  inputWrapper: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    borderRadius: 6,
    padding: '6px 10px'
  },
  searchIcon: {
    flexShrink: 0
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 12,
    minWidth: 0
  },
  cancelButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    display: 'flex'
  },
  message: {
    fontSize: 11,
    textAlign: 'center',
    padding: '8px 0'
  },
  banner: {
    fontSize: 10,
    padding: '6px 2px 0'
  },
  popularLabel: {
    fontSize: 10,
    padding: '6px 2px 0',
    letterSpacing: 0.5
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 6,
    maxHeight: 180,
    overflowY: 'auto'
  },
  resultButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 5,
    borderRadius: 6,
    cursor: 'pointer',
    textAlign: 'left'
  },
  resultImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    flexShrink: 0
  },
  resultImagePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11
  },
  resultName: {
    fontSize: 12,
    flex: 1
  }
};
