// based on Dan As: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
//
import { useEffect, useRef } from 'react';

export default function useInterval(callback: Function, delay: number | null) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // can set delay null to pause interval polling
    if (delay != null) {
      let intervalId = setInterval(() => {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }, delay);

      return () => clearInterval(intervalId);
    }

  }, [delay])
}