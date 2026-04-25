import React from 'react';
import { STARS } from '../../constants/commanders';

export const ThemeDecoration = ({ theme }) => {
  if (theme.decoration === 'stars') {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op} />
        ))}
      </svg>
    );
  }
  if (theme.decoration === 'runes') {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 380 720" preserveAspectRatio="xMidYMid meet">
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
