import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

export const MousePositionContext = createContext({
  x: 0,
  y: 0,
  rawX: 0,
  rawY: 0,
  isSupported: false
});

export const MousePositionProvider = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const [isSupported, setIsSupported] = useState(false);
  const mouseRef = useRef({ rawX: 0, rawY: 0 });
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setIsSupported(false);
      return;
    }

    let pointerQuery = null;
    try {
      pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    } catch (e) {
      console.warn('matchMedia check failed in MousePositionContext:', e);
    }

    const checkSupport = () => {
      const matches = pointerQuery ? pointerQuery.matches : false;
      setIsSupported(matches);
    };

    checkSupport();

    if (pointerQuery) {
      if (pointerQuery.addEventListener) {
        pointerQuery.addEventListener('change', checkSupport);
      } else if (pointerQuery.addListener) {
        pointerQuery.addListener(checkSupport);
      }
    }

    return () => {
      if (pointerQuery) {
        if (pointerQuery.removeEventListener) {
          pointerQuery.removeEventListener('change', checkSupport);
        } else if (pointerQuery.removeListener) {
          pointerQuery.removeListener(checkSupport);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const updatePosition = () => {
      const { rawX, rawY } = mouseRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Normalized coordinates: range from -1 to 1 relative to center
      const normalizedX = (rawX - width / 2) / (width / 2);
      const normalizedY = (rawY - height / 2) / (height / 2);

      // Clamp values between -1 and 1
      const clampedX = Math.max(-1, Math.min(1, normalizedX));
      const clampedY = Math.max(-1, Math.min(1, normalizedY));

      setPosition({
        x: clampedX,
        y: clampedY,
        rawX,
        rawY
      });

      animFrameIdRef.current = null;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { rawX: e.clientX, rawY: e.clientY };

      if (animFrameIdRef.current === null) {
        animFrameIdRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isSupported]);

  return (
    <MousePositionContext.Provider value={{ ...position, isSupported }}>
      {children}
    </MousePositionContext.Provider>
  );
};

export const useMousePosition = () => useContext(MousePositionContext);
