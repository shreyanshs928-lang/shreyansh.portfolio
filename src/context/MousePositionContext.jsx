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

    let hoverQuery = null;
    let motionQuery = null;
    try {
      hoverQuery = window.matchMedia('(hover: hover)');
      motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch (e) {
      console.warn('matchMedia check failed in MousePositionContext:', e);
    }

    const checkSupport = () => {
      const hoverMatches = hoverQuery ? hoverQuery.matches : false;
      const motionMatches = motionQuery ? motionQuery.matches : false;
      setIsSupported(hoverMatches && !motionMatches);
    };

    checkSupport();

    if (hoverQuery && motionQuery) {
      if (hoverQuery.addEventListener) {
        hoverQuery.addEventListener('change', checkSupport);
        motionQuery.addEventListener('change', checkSupport);
      } else if (hoverQuery.addListener) {
        hoverQuery.addListener(checkSupport);
        motionQuery.addListener(checkSupport);
      }
    }

    return () => {
      if (hoverQuery && motionQuery) {
        if (hoverQuery.removeEventListener) {
          hoverQuery.removeEventListener('change', checkSupport);
          motionQuery.removeEventListener('change', checkSupport);
        } else if (hoverQuery.removeListener) {
          hoverQuery.removeListener(checkSupport);
          motionQuery.removeListener(checkSupport);
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
