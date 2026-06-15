import { useEffect, useRef, useState, useContext } from 'react';
import { CursorContext } from '../context/CursorContext';

export const useCursor = () => {
  const { magneticElement } = useContext(CursorContext);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Outer circle ring coordinates with smooth lerp
  const dotPosRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const glowPosRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isFirstMove = useRef(true);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    let mediaQuery = null;
    try {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    } catch (e) {
      console.warn('matchMedia check failed in useCursor:', e);
    }

    const listener = (e) => setPrefersReducedMotion(e.matches);

    if (mediaQuery) {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener);
      }
    }

    return () => {
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(listener);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // Instantly position elements on the very first mouse movement to avoid jumping from (0,0)
      if (isFirstMove.current) {
        dotPosRef.current = { x: e.clientX, y: e.clientY };
        ringPosRef.current = { x: e.clientX, y: e.clientY };
        glowPosRef.current = { x: e.clientX, y: e.clientY };
        isFirstMove.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  // RequestAnimationFrame loop to calculate lerps for the 3 elements
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animFrameId;
    
    const updateCursorPositions = () => {
      let targetX = mousePosRef.current.x;
      let targetY = mousePosRef.current.y;

      // Magnetic snapping calculations
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect();
        // Element center coordinates
        const elemCenterX = rect.left + rect.width / 2;
        const elemCenterY = rect.top + rect.height / 2;

        // Calculate distance from mouse to center
        const dx = mousePosRef.current.x - elemCenterX;
        const dy = mousePosRef.current.y - elemCenterY;

        // Snapping target position: locks to center, but allows a 35% organic drag
        targetX = elemCenterX + dx * 0.35;
        targetY = elemCenterY + dy * 0.35;
      }

      // Linear interpolation (lerp) formulas for different lag stages
      // 1. Precision Dot (fast follow: factor 0.35)
      dotPosRef.current.x += (targetX - dotPosRef.current.x) * 0.35;
      dotPosRef.current.y += (targetY - dotPosRef.current.y) * 0.35;

      // 2. Main Ring (medium follow: factor 0.16)
      ringPosRef.current.x += (targetX - ringPosRef.current.x) * 0.16;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * 0.16;

      // 3. Outer Aura Glow (slow follow: factor 0.08)
      glowPosRef.current.x += (targetX - glowPosRef.current.x) * 0.08;
      glowPosRef.current.y += (targetY - glowPosRef.current.y) * 0.08;

      // Direct DOM injection to completely bypass React re-renders on mousemove
      const dotEl = document.getElementById('custom-cursor-dot');
      const ringEl = document.getElementById('custom-cursor-ring');
      const glowEl = document.getElementById('custom-cursor-glow');

      if (dotEl) {
        dotEl.style.transform = `translate3d(${dotPosRef.current.x}px, ${dotPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowEl) {
        glowEl.style.transform = `translate3d(${glowPosRef.current.x}px, ${glowPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(updateCursorPositions);
    };

    animFrameId = requestAnimationFrame(updateCursorPositions);
    return () => cancelAnimationFrame(animFrameId);
  }, [magneticElement, prefersReducedMotion]);

  return {
    prefersReducedMotion
  };
};
