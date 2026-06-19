import { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { CursorContext } from '../context/CursorContext';

/**
 * Hook for clickable/interactive elements to opt into the cursor hover state.
 */
export const useCursor = (label = '') => {
  const { triggerHover, triggerDefault } = useContext(CursorContext);

  const cursorHoverProps = useMemo(() => ({
    onMouseEnter: (e) => triggerHover(label, e.currentTarget),
    onMouseLeave: triggerDefault
  }), [label, triggerHover, triggerDefault]);

  return {
    cursorHoverProps
  };
};

/**
 * Hook for cards/panels to calculate 3D tilt and cast a directional shadow away from the cursor.
 */
export const useDirectionalHover = (label = 'View') => {
  const { triggerHover, triggerDefault } = useContext(CursorContext);
  const elementRef = useRef(null);
  const isHovered = useRef(false);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const animFrameId = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Detect touch screen devices via matchMedia check
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer) {
      return; // Touch devices fallback to native pointer/tap behaviors
    }

    const handleMouseMove = (e) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e) => {
      isHovered.current = true;
      triggerHover(label, el);

      if (prefersReducedMotion) return;

      el.classList.add('directional-hover-element', 'is-tracking');
      
      // Store initial coordinates
      mouseCoords.current = { x: e.clientX, y: e.clientY };

      // Attach mousemove only while hovering
      window.addEventListener('mousemove', handleMouseMove);

      if (animFrameId.current === null) {
        animFrameId.current = requestAnimationFrame(updateShadowAndTilt);
      }
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      triggerDefault();

      // Remove mousemove listener immediately on leave
      window.removeEventListener('mousemove', handleMouseMove);

      if (prefersReducedMotion) return;

      el.classList.remove('is-tracking');
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }

      // Smoothly animate back to neutral values using CSS transition
      el.style.setProperty('--shadow-x', '0px');
      el.style.setProperty('--shadow-y', '0px');
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
      el.style.setProperty('--glow-color', 'transparent');
    };

    const updateShadowAndTilt = () => {
      if (!isHovered.current || !elementRef.current) {
        animFrameId.current = null;
        return;
      }

      const rect = el.getBoundingClientRect();
      const mouseX = mouseCoords.current.x;
      const mouseY = mouseCoords.current.y;

      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Normalized relative offset: ranges from -0.5 to 0.5
      const offsetX = (mouseX - elementCenterX) / rect.width;
      const offsetY = (mouseY - elementCenterY) / rect.height;

      // Clamp normalized values to element boundaries
      const clampedX = Math.max(-0.5, Math.min(0.5, offsetX));
      const clampedY = Math.max(-0.5, Math.min(0.5, offsetY));

      // Directional shadow falls OPPOSITE to the cursor spotlight
      const shadowX = -clampedX * 40;
      const shadowY = -clampedY * 40;

      // Card tilts/leans away from the cursor light source (max ±5 degrees)
      const tiltX = clampedY * 5;
      const tiltY = -clampedX * 5;

      el.style.setProperty('--shadow-x', `${shadowX}px`);
      el.style.setProperty('--shadow-y', `${shadowY}px`);
      el.style.setProperty('--tilt-x', `${tiltX}deg`);
      el.style.setProperty('--tilt-y', `${tiltY}deg`);

      // Calculate dynamic glow color based on cursor X coordinate
      const t = window.innerWidth > 0 ? mouseX / window.innerWidth : 0.5;
      const r = Math.round(139 + (255 - 139) * t);
      const g = Math.round(92 + (138 - 92) * t);
      const b = Math.round(246 + (76 - 246) * t);
      el.style.setProperty('--glow-color', `rgba(${r}, ${g}, ${b}, 0.25)`);

      animFrameId.current = requestAnimationFrame(updateShadowAndTilt);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [label, triggerHover, triggerDefault]);

  return {
    ref: elementRef,
    style: {
      '--shadow-x': '0px',
      '--shadow-y': '0px',
      '--tilt-x': '0deg',
      '--tilt-y': '0deg',
      '--glow-color': 'transparent'
    }
  };
};

/**
 * Coordinate tracker loop used by the Cursor and Spotlight layers to handle smooth lagging.
 */
export const useCursorPosition = (dotId, ringId, glowId, spotlightId, isDisabled, prefersReducedMotion, cursorType) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const spotlightPos = useRef({ x: 0, y: 0 });
  const isFirstMove = useRef(true);
  const cursorTypeRef = useRef(cursorType);

  useEffect(() => {
    cursorTypeRef.current = cursorType;
  }, [cursorType]);

  useEffect(() => {
    if (isDisabled) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isFirstMove.current) {
        dotPos.current = { x: e.clientX, y: e.clientY };
        ringPos.current = { x: e.clientX, y: e.clientY };
        glowPos.current = { x: e.clientX, y: e.clientY };
        spotlightPos.current = { x: e.clientX, y: e.clientY };
        isFirstMove.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDisabled]);

  useEffect(() => {
    if (isDisabled) return;

    let animId;

    const updatePositions = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      if (prefersReducedMotion) {
        // Instant tracking: no lag/lerp
        dotPos.current.x = targetX;
        dotPos.current.y = targetY;
        ringPos.current.x = targetX;
        ringPos.current.y = targetY;
        glowPos.current.x = targetX;
        glowPos.current.y = targetY;
        spotlightPos.current.x = targetX;
        spotlightPos.current.y = targetY;
      } else {
        // 1. Inner precision dot (fast follow: 0.35 lerp)
        dotPos.current.x += (targetX - dotPos.current.x) * 0.35;
        dotPos.current.y += (targetY - dotPos.current.y) * 0.35;

        // 2. Middle ring (medium follow: 0.16 lerp)
        ringPos.current.x += (targetX - ringPos.current.x) * 0.16;
        ringPos.current.y += (targetY - ringPos.current.y) * 0.16;

        // 3. Outer dashed aura (slow follow: 0.08 lerp)
        glowPos.current.x += (targetX - glowPos.current.x) * 0.08;
        glowPos.current.y += (targetY - glowPos.current.y) * 0.08;

        // 4. Background spotlight (ambient lag follow: 0.05 lerp)
        spotlightPos.current.x += (targetX - spotlightPos.current.x) * 0.05;
        spotlightPos.current.y += (targetY - spotlightPos.current.y) * 0.05;
      }

      // Update DOM styles directly to avoid React state triggers
      const dotEl = document.getElementById(dotId);
      const ringEl = document.getElementById(ringId);
      const glowEl = document.getElementById(glowId);
      const spotlightEls = document.querySelectorAll('.global-ambient-spotlight');

      if (dotEl) {
        dotEl.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowEl) {
        glowEl.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Calculate color interpolation based on normalized screen X coordinate
      const t = window.innerWidth > 0 ? targetX / window.innerWidth : 0.5;
      const isHover = cursorTypeRef.current === 'hover';
      
      const rStart = isHover ? 168 : 139;
      const rEnd = isHover ? 249 : 255;
      const gStart = isHover ? 85 : 92;
      const gEnd = isHover ? 115 : 138;
      const bStart = isHover ? 247 : 246;
      const bEnd = isHover ? 22 : 76;

      const r = Math.round(rStart + (rEnd - rStart) * t);
      const g = Math.round(gStart + (gEnd - gStart) * t);
      const b = Math.round(bStart + (bEnd - bStart) * t);
      
      const opacityVal = isHover ? 0.38 : 0.13;
      const scaleVal = prefersReducedMotion ? 1.0 : (isHover ? 1.2 : 1.0);

      spotlightEls.forEach(el => {
        el.style.transform = `translate3d(${spotlightPos.current.x}px, ${spotlightPos.current.y}px, 0)`;
        el.style.setProperty('--spotlight-color', `rgba(${r}, ${g}, ${b}, 1)`);
        el.style.opacity = opacityVal;
        el.style.scale = scaleVal;
      });

      animId = requestAnimationFrame(updatePositions);
    };

    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, [dotId, ringId, glowId, spotlightId, isDisabled, prefersReducedMotion]);
};
