import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CursorContext } from '../context/CursorContext';
import { useCursor } from '../hooks/useCursor';

export const Cursor = () => {
  const { cursorType, cursorLabel } = useContext(CursorContext);
  const { prefersReducedMotion } = useCursor();
  const [isMobile, setIsMobile] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Detect mobile / touch screen device
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(hasTouch || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isMobile || prefersReducedMotion || isAdminRoute) {
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
  }, [isMobile, prefersReducedMotion, isAdminRoute]);

  // Hide cursor on mobile, if reduced motion is requested, or on admin routes
  if (isMobile || prefersReducedMotion || isAdminRoute) return null;


  // Render Portal to document.body
  return ReactDOM.createPortal(
    <>
      {/* 1. Inner Precision Dot (no lag, fast tracker) */}
      <div
        id="custom-cursor-dot"
        className="will-animate"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10002,
          transition: 'width 0.2s, height 0.2s, background-color 0.2s'
        }}
      />

      {/* 2. Outer Smooth Lagging Ring */}
      <div
        id="custom-cursor-ring"
        className="cursor-ring-glow will-animate"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          border: '1.5px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Mix blend mode difference creates an inverted colors look on dark/light assets
          mixBlendMode: 'difference',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, scale 0.15s',
          backgroundColor: cursorType === 'hover' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0)',
          borderColor: cursorType === 'hover' ? '#ffffff' : 'var(--accent)',
          width: cursorType === 'hover' ? '58px' : '24px',
          height: cursorType === 'hover' ? '58px' : '24px',
          scale: isClicked ? 0.75 : 1
        }}
      >
        {/* Floating view/open label inside expanding cursor */}
        {cursorType === 'hover' && cursorLabel && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: '#ffffff',
              pointerEvents: 'none',
              animation: 'fade-in 0.2s ease forwards'
            }}
          >
            {cursorLabel}
          </span>
        )}
      </div>

      {/* 3. Outer Dashed Aura Tracker (heavy lag, elastic effect) */}
      <div
        id="custom-cursor-glow"
        className="will-animate"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(99, 102, 241, 0.22)',
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s, border-color 0.4s, scale 0.2s',
          width: cursorType === 'hover' ? '92px' : '48px',
          height: cursorType === 'hover' ? '92px' : '48px',
          scale: isClicked ? 1.25 : 1
        }}
      />
    </>,
    document.body
  );
};
