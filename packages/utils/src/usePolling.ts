import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void | Promise<void>, interval: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval !== null) {
      let timeoutId: NodeJS.Timeout;
      let isRunning = false;
      const tick = async () => {
        if (isRunning) return;
        isRunning = true;
        try {
          await savedCallback.current();
        } finally {
          isRunning = false;
          timeoutId = setTimeout(tick, interval);
        }
      };
      
      timeoutId = setTimeout(tick, interval);
      return () => clearTimeout(timeoutId);
    }
  }, [interval]);
}
