import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CursorContext } from '../context/CursorContext';
import { useCursorPosition } from '../hooks/useCursor';

export const Spotlight = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

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

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isMobile || isAdminRoute) return null;

  return (
    <div
      className="global-ambient-spotlight pointer-events-none fixed z-1"
      style={{
        position: 'fixed',
        top: -150,
        left: -150,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.07) 0%, rgba(249, 115, 22, 0.04) 40%, transparent 70%)',
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s linear',
        willChange: 'transform, opacity'
      }}
    />
  );
};

export const Cursor = () => {
  const { cursorType, cursorLabel, triggerHover, triggerDefault } = useContext(CursorContext);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Hook coordinates updates for cursor elements
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
      const timer = setTimeout(() => setShowLabel(true), 150);
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

    // Global listener to detect hover on any clickable element
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const clickable = target.closest('a, button, input[type="submit"], input[type="button"], [role="button"], .clickable, .btn, .social-icon-btn, .nav-link, .logo, [data-cursor-hover]');
      if (clickable) {
        const label = clickable.getAttribute('data-cursor-label') || '';
        triggerHover(label, clickable);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const related = e.relatedTarget;
      const clickable = target ? target.closest('a, button, input[type="submit"], input[type="button"], [role="button"], .clickable, .btn, .social-icon-btn, .nav-link, .logo, [data-cursor-hover]') : null;
      const relatedClickable = related ? related.closest('a, button, input[type="submit"], input[type="button"], [role="button"], .clickable, .btn, .social-icon-btn, .nav-link, .logo, [data-cursor-hover]') : null;
      
      if (clickable && !relatedClickable) {
        triggerDefault();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isMobile, isAdminRoute, triggerHover, triggerDefault]);

  if (isMobile || isAdminRoute) return null;

  return ReactDOM.createPortal(
    <>
      {/* 1. Inner dot / Morphed pill in modern charcoal */}
      <div
        id="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: cursorType === 'hover' ? '20px' : '50%',
          pointerEvents: 'none',
          zIndex: 10002,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: cursorType === 'hover' ? (cursorLabel ? '56px' : '36px') : '10px',
          height: cursorType === 'hover' ? '36px' : '10px',
          backgroundColor: '#0F172A',
          boxShadow: cursorType === 'hover' ? '0 10px 25px -5px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 2px 8px rgba(0,0,0,0.15)',
          scale: isClicked ? 0.9 : 1.0,
          transition: 'width 220ms cubic-bezier(0.16, 1, 0.3, 1), height 220ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms, box-shadow 200ms, scale 150ms',
          willChange: 'transform, width, height, scale'
        }}
      >
        {cursorType === 'hover' && cursorLabel && showLabel && (
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: '#FFFFFF',
              pointerEvents: 'none',
              animation: 'fade-in 0.15s ease forwards',
              whiteSpace: 'nowrap',
              padding: '0 4px'
            }}
          >
            {cursorLabel}
          </span>
        )}
      </div>

      {/* 2. Outer ring */}
      {!prefersReducedMotion && (
        <div
          id="custom-cursor-ring"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: '1px solid rgba(15, 23, 42, 0.2)',
            pointerEvents: 'none',
            zIndex: 10001,
            width: cursorType === 'hover' ? '48px' : '28px',
            height: cursorType === 'hover' ? '48px' : '28px',
            opacity: cursorType === 'hover' ? 0 : 0.8,
            scale: isClicked ? 0.75 : 1.0,
            transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), scale 150ms',
            willChange: 'transform, width, height, scale, opacity'
          }}
        />
      )}

      {/* 3. Outer dashed aura */}
      {!prefersReducedMotion && (
        <div
          id="custom-cursor-glow"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            backgroundColor: 'rgba(99, 102, 241, 0.03)',
            pointerEvents: 'none',
            zIndex: 10000,
            width: cursorType === 'hover' ? '76px' : '48px',
            height: cursorType === 'hover' ? '76px' : '48px',
            opacity: cursorType === 'hover' ? 0.4 : 0.7,
            scale: isClicked ? 1.15 : 1.0,
            transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), height 300ms cubic-bezier(0.16, 1, 0.3, 1), scale 200ms, opacity 300ms',
            willChange: 'transform, width, height, scale, opacity'
          }}
        />
      )}
    </>,
    document.body
  );
};
