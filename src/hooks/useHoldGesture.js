import { useRef, useEffect } from 'react';

export function useHoldGesture({ onTrigger, delay = 400, interval = 120, enabled = true }) {
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
        intervalRef.current = setInterval(() => onTrigger(), interval);
      }, delay);
    }
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return {
    onMouseDown: (e) => { e.preventDefault(); start(); },
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: (e) => { e.preventDefault(); start(); },
    onTouchEnd: stop,
    onTouchCancel: stop
  };
}
