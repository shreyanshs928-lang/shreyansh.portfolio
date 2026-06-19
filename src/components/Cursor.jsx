import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CursorContext } from '../context/CursorContext';
import { useCursorPosition } from '../hooks/useCursor';

export const Spotlight = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile / touch screen device (fine pointer query)
    const checkDevice = () => {
      const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsMobile(!isFine);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
    } catch (e) {
      console.warn(e);
    }

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isMobile || isAdminRoute) return null;

  return (
    <div
      className="global-ambient-spotlight"
      style={{
        position: 'fixed',
        top: -300, // half of 600px to center it on 0,0
        left: -300,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.13,
        background: 'radial-gradient(circle, var(--spotlight-color, rgba(139, 92, 246, 0.12)) 0%, transparent 70%)',
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), scale 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, scale'
      }}
    />
  );
};

export const Cursor = () => {
  const { cursorType, cursorLabel } = useContext(CursorContext);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Hook handles coordination of all DOM elements position updates
  useCursorPosition(
    'custom-cursor-dot',
    'custom-cursor-ring',
    'custom-cursor-glow',
    'global-ambient-spotlight',
    isMobile,
    prefersReducedMotion,
    cursorType
  );

  useEffect(() => {
    const checkDevice = () => {
      const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsMobile(!isFine);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
    } catch (e) {
      console.warn(e);
    }

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (cursorType === 'hover') {
      // Morph takes 200ms, label appears with 100ms delay after morph completes = 300ms total
      const timer = setTimeout(() => setShowLabel(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [cursorType]);

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isMobile || isAdminRoute) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isMobile, isAdminRoute]);

  if (isMobile || isAdminRoute) return null;

  return ReactDOM.createPortal(
    <>
      {/* 1. Inner dot / Morphed circle */}
      <div
        id="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10002,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // State 1: 10px white 70% opacity
          // State 2: 38px solid white, subtle inner shadow
          width: cursorType === 'hover' ? '38px' : '10px',
          height: cursorType === 'hover' ? '38px' : '10px',
          backgroundColor: '#ffffff',
          opacity: cursorType === 'hover' ? 1.0 : 0.7,
          boxShadow: cursorType === 'hover' ? 'inset 0 2px 5px rgba(0,0,0,0.2), 0 2px 10px rgba(0,0,0,0.1)' : 'none',
          scale: isClicked ? 0.85 : 1.0,
          transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), scale 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, width, height, scale, opacity'
        }}
      >
        {/* State 2 Label Text inside morphed cursor */}
        {cursorType === 'hover' && cursorLabel && showLabel && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 800,
              color: '#000000',
              pointerEvents: 'none',
              animation: 'fade-in 0.15s ease forwards'
            }}
          >
            {cursorLabel}
          </span>
        )}
      </div>

      {/* 2. Outer ring (fades out and merges into morphed circle on hover; hidden if reduced motion is preferred) */}
      {!prefersReducedMotion && (
        <div
          id="custom-cursor-ring"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: 'none',
            zIndex: 10001,
            // State 1: 24px diameter, 20% opacity
            // State 2: Fades out and matches morph size
            width: cursorType === 'hover' ? '38px' : '24px',
            height: cursorType === 'hover' ? '38px' : '24px',
            opacity: cursorType === 'hover' ? 0 : 1,
            scale: isClicked ? 0.75 : 1.0,
            transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), scale 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, width, height, scale, opacity'
          }}
        />
      )}

      {/* 3. Outer dashed aura (elastic follow, slow lerp; hidden if reduced motion is preferred) */}
      {!prefersReducedMotion && (
        <div
          id="custom-cursor-glow"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            pointerEvents: 'none',
            zIndex: 10000,
            width: cursorType === 'hover' ? '80px' : '48px',
            height: cursorType === 'hover' ? '80px' : '48px',
            opacity: cursorType === 'hover' ? 0.3 : 1.0,
            scale: isClicked ? 1.2 : 1.0,
            transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), height 300ms cubic-bezier(0.16, 1, 0.3, 1), scale 200ms, opacity 300ms',
            willChange: 'transform, width, height, scale, opacity'
          }}
        />
      )}
    </>,
    document.body
  );
};
