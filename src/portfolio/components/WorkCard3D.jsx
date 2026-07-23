import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CursorContext } from '../../context/CursorContext';

// Vector SVG placeholders matching existing designs
const placeholderSvgs = {
  'social-1': (
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#1A1A1E"/>
      <rect x="20" y="20" width="260" height="260" stroke="#4F46E5" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="40" y="70" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="28">MI '25</text>
      <text x="40" y="105" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="500" fontSize="14">THEME REVEAL</text>
      <line x1="40" y1="125" x2="260" y2="125" stroke="rgba(255,255,255,0.05)"/>
      <circle cx="210" cy="210" r="45" fill="rgba(99, 102, 241, 0.15)" stroke="#4F46E5" strokeWidth="1"/>
      <path d="M 195 210 Q 210 185 225 210 Q 210 235 195 210" stroke="#FFFFFF" fill="none"/>
    </svg>
  ),
  'social-2': (
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#18181C"/>
      <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2"/>
      <path d="M 60 150 L 240 150 M 150 60 L 150 240" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4"/>
      <text x="40" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="24">E-SUMMIT</text>
      <text x="40" y="105" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="24">ANNOUNCEMENT</text>
      <rect x="40" y="220" width="85" height="25" fill="#4F46E5" rx="2"/>
      <text x="48" y="236" fill="#FFFFFF" fontFamily="Inter" fontWeight="600" fontSize="10">E-CELL IITB</text>
    </svg>
  ),
  'social-3': (
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#1A1A1E"/>
      <path d="M 30 250 L 120 70 L 210 250 Z" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
      <path d="M 100 250 L 160 130 L 220 250 Z" stroke="#4F46E5" strokeWidth="1.5" strokeOpacity="0.6"/>
      <text x="30" y="60" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">INTER-IIT '26</text>
      <text x="30" y="82" fill="rgba(255,255,255,0.4)" fontFamily="Inter" fontSize="12">ATHLETICS CONTINGENT</text>
    </svg>
  ),
  'print-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/>
      <rect x="40" y="40" width="240" height="295" fill="#1A1A1E" stroke="rgba(255,255,255,0.03)"/>
      <rect x="300" y="40" width="260" height="295" fill="#1A1A1E" stroke="rgba(255,255,255,0.03)"/>
      <text x="50" y="320" fill="rgba(255,255,255,0.2)" fontFamily="Space Grotesk" fontSize="10">PAGE 12</text>
      <text x="525" y="320" fill="rgba(255,255,255,0.2)" fontFamily="Space Grotesk" fontSize="10">PAGE 13</text>
      <circle cx="430" cy="150" r="50" stroke="#4F46E5" strokeOpacity="0.3" strokeWidth="1"/>
      <line x1="430" y1="80" x2="430" y2="220" stroke="#4F46E5" strokeOpacity="0.2"/>
      <line x1="360" y1="150" x2="500" y2="150" stroke="#4F46E5" stroke-opacity="0.2"/>
      <text x="60" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="18">01. PROPULSION</text>
      <rect x="60" y="105" width="200" height="8" fill="rgba(255,255,255,0.08)" rx="1"/>
      <rect x="60" y="120" width="170" height="8" fill="rgba(255,255,255,0.08)" rx="1"/>
      <rect x="60" y="135" width="190" height="8" fill="rgba(255,255,255,0.08)" rx="1"/>
      <rect x="60" y="150" width="130" height="8" fill="rgba(255,255,255,0.08)" rx="1"/>
      <text x="320" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="28">AETHER</text>
      <text x="320" y="105" fill="#4F46E5" fontFamily="Space Grotesk" fontSize="12">ANNUAL SCIENTIFIC JOURNAL</text>
    </svg>
  ),
  'print-2': (
    <svg width="100%" height="100%" viewBox="0 0 350 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#18181B"/>
      <rect x="30" y="30" width="290" height="315" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
      <circle cx="175" cy="180" r="75" fill="none" stroke="#4F46E5" strokeOpacity="0.3" strokeWidth="1"/>
      <text x="50" y="90" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="22">M.I. BOOKLET</text>
      <text x="50" y="112" fill="rgba(255,255,255,0.4)" fontFamily="Inter" fontSize="11">CULTURAL FESTIVAL SCHEDULE</text>
      <line x1="50" y1="140" x2="300" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <rect x="50" y="170" width="110" height="110" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99,102,241,0.2)"/>
      <circle cx="105" cy="225" r="25" stroke="#FFFFFF" strokeOpacity="0.1"/>
    </svg>
  ),
  'ui-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0F0F11"/>
      <rect x="0" y="0" width="80" height="200" fill="#141417"/>
      <circle cx="40" cy="35" r="15" fill="#4F46E5"/>
      <rect x="15" y="70" width="50" height="6" fill="rgba(255,255,255,0.1)" rx="1"/>
      <rect x="15" y="85" width="50" height="6" fill="rgba(255,255,255,0.1)" rx="1"/>
      <rect x="15" y="100" width="50" height="6" fill="rgba(255,255,255,0.1)" rx="1"/>
      <text x="100" y="40" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="14">E-CELL PORTAL</text>
      <rect x="100" y="60" width="130" height="60" fill="#1B1B1F" rx="3" stroke="rgba(255,255,255,0.03)"/>
      <text x="110" y="80" fill="#8E8E93" fontFamily="Inter" fontSize="8">ENTREPRENEURS</text>
      <text x="110" y="98" fill="#FFFFFF" fontFamily="Space Grotesk" fontSize="14" fontWeight="bold">1,420+</text>
      <rect x="245" y="60" width="130" height="60" fill="#1B1B1F" rx="3" stroke="rgba(255,255,255,0.03)"/>
      <text x="255" y="80" fill="#8E8E93" fontFamily="Inter" fontSize="8">STARTUPS REGISTERED</text>
      <text x="255" y="98" fill="#FFFFFF" fontFamily="Space Grotesk" fontSize="14" fontWeight="bold">120+</text>
      <path d="M 100 170 L 150 140 L 200 160 L 250 130 L 300 150 L 375 125" stroke="#4F46E5" strokeWidth="2" fill="none"/><circle cx="375" cy="125" r="3" fill="#FFFFFF"/>
    </svg>
  ),
  'ui-2': (
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0F0F11"/>
      <text x="25" y="35" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="12">FLIGHT TELEMETRY</text>
      <rect x="25" y="55" width="200" height="120" fill="#141417" rx="3" stroke="rgba(99,102,241,0.1)"/>
      <circle cx="125" cy="115" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <circle cx="125" cy="115" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <line x1="125" y1="70" x2="125" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <line x1="80" y1="115" x2="170" y2="115" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <line x1="125" y1="115" x2="155" y2="95" stroke="#4F46E5" strokeWidth="1.5"/>
      <rect x="240" y="55" width="135" height="50" fill="#141417" rx="3" stroke="rgba(255,255,255,0.03)"/>
      <text x="250" y="72" fill="#8E8E93" fontFamily="Inter" fontSize="7">APOGEE ALTITUDE</text>
      <text x="250" y="90" fill="#FFFFFF" fontFamily="Space Grotesk" fontSize="12" fontWeight="bold">10,420 FT</text>
      <rect x="240" y="115" width="135" height="60" fill="#141417" rx="3" stroke="rgba(255,255,255,0.03)"/>
      <text x="250" y="132" fill="#8E8E93" fontFamily="Inter" fontSize="7">VELOCITY STAGE</text>
      <text x="250" y="152" fill="#FFFFFF" fontFamily="Space Grotesk" fontSize="12" fontWeight="bold">MACH 1.12</text>
    </svg>
  ),
  'reels-1': (
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/><rect x="15" y="15" width="195" height="370" stroke="rgba(255,255,255,0.03)"/>
      <circle cx="112.5" cy="200" r="60" fill="rgba(99, 102, 241, 0.05)" stroke="#4F46E5" strokeOpacity="0.3"/>
      <rect x="62.5" y="320" width="4" height="25" fill="#4F46E5" rx="2"/><rect x="72.5" y="310" width="4" height="45" fill="#4F46E5" rx="2"/>
      <rect x="82.5" y="295" width="4" height="75" fill="#4F46E5" rx="2"/><rect x="92.5" y="280" width="4" height="105" fill="#FFFFFF" rx="2"/>
      <rect x="102.5" y="290" width="4" height="85" fill="#FFFFFF" rx="2"/><rect x="112.5" y="270" width="4" height="125" fill="#4F46E5" rx="2"/>
      <rect x="122.5" y="295" width="4" height="75" fill="#4F46E5" rx="2"/><rect x="132.5" y="305" width="4" height="55" fill="#4F46E5" rx="2"/>
      <rect x="142.5" y="315" width="4" height="35" fill="rgba(255,255,255,0.2)" rx="2"/>
      <text x="30" y="60" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="16">AFTERMOVIE</text>
      <text x="30" y="80" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">PROMO HYPEX</text>
    </svg>
  ),
  'reels-2': (
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#1A1A1E"/><rect x="15" y="15" width="195" height="370" stroke="rgba(255,255,255,0.03)"/>
      <text x="30" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">01</text>
      <text x="30" y="105" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">IDEA</text>
      <text x="30" y="130" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">LAUNCH</text>
      <circle cx="112.5" cy="270" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
      <path d="M 112.5 220 A 50 50 0 0 1 162.5 270" stroke="#4F46E5" strokeWidth="3" fill="none"/>
    </svg>
  ),
  'reels-3': (
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/><rect x="15" y="15" width="195" height="370" stroke="rgba(255,255,255,0.03)"/>
      <text x="30" y="60" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="16">STARTUP</text>
      <text x="30" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="16">COMMUNITY</text>
      <text x="30" y="100" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">INTERVIEW REELS</text>
      <path d="M 30 250 C 60 200, 90 300, 120 250 C 150 200, 180 300, 195 250" stroke="#4F46E5" strokeOpacity="0.6" strokeWidth="2" fill="none"/>
      <path d="M 30 250 C 60 220, 90 280, 120 250 C 150 220, 180 280, 195 250" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
    </svg>
  ),
  'video-1': (
    <svg width="100%" height="100%" viewBox="0 0 500 281" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#18181B"/><path d="M 0 140 Q 125 40 250 140 T 500 140" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none"/>
      <line x1="250" y1="0" x2="250" y2="281" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <path d="M 230 140 L 250 100 L 270 140" fill="#4F46E5" fillOpacity="0.3" stroke="#4F46E5" strokeWidth="1"/>
      <text x="40" y="50" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">ROCKET LAUNCH</text>
      <text x="40" y="72" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">TEST FLIGHT DOCUMENTARY</text>
    </svg>
  ),
  'video-2': (
    <svg width="100%" height="100%" viewBox="0 0 500 281" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/><rect x="50" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <rect x="200" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <rect x="350" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <circle cx="250" cy="140" r="40" fill="rgba(99, 102, 241, 0.1)" stroke="#4F46E5" strokeOpacity="0.3"/><text x="40" y="250" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">CAMPUS LIFE</text>
      <text x="40" y="265" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">MINI DOCUMENTARY</text>
    </svg>
  ),
  'branding-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#131316"/><circle cx="200" cy="140" r="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <circle cx="200" cy="140" r="45" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1"/>
      <path d="M 200 40 L 200 240 M 100 140 L 300 140" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
      <path d="M 160 190 L 200 90 L 240 190" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 180 150 L 220 150" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
      <text x="200" y="245" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="22" letterSpacing="0.1em">ALUMINATION</text>
      <text x="200" y="265" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontFamily="Inter" fontSize="9" letterSpacing="0.2em">IIT BOMBAY</text>
    </svg>
  )
};

const RenderMedia = ({ imageStr }) => {
  if (!imageStr) return null;
  if (imageStr.startsWith('svg:')) {
    const key = imageStr.split(':')[1];
    return placeholderSvgs[key] || null;
  }
  return <img src={imageStr} alt="Project Media" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

export const WorkCard3D = ({ project, index, type }) => {
  const cardRef = useRef(null);
  const controls = useAnimation();
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Schema Mapping with Fallback support for older DB fields
  const p = project || {};
  const title = p.title || "";
  const categoryLabel = p.categoryLabel || p.tag || "Project";
  const thumbnailImage = p.thumbnailImage || p.image || "";
  const description = p.description || p.desc || "";
  const organization = p.organization || p.org || "";
  const projectLink = p.projectLink || p.link || "";
  const caseStudyLink = p.caseStudyLink || p.caseStudyUrl || "";
  const accentColor = p.accentColor || "#8B5CF6";
  const tools = Array.isArray(p.tools) ? p.tools : [];
  const date = p.date || "";

  // Helper to convert hex to rgba for tinted shadow glow
  const getAccentShadowColor = (hex) => {
    if (!hex) return "rgba(139, 92, 246, 0.3)";
    // Simple hex to rgb
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, 0.35)`;
    }
    return "rgba(139, 92, 246, 0.3)";
  };

  const accentShadowColor = getAccentShadowColor(accentColor);

  useEffect(() => {
    // Detect Touch Capabilities
    setIsTouchDevice(!window.matchMedia('(hover: hover)').matches);

    // Detect Motion Preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Defer Hover Binding using IntersectionObserver (1.5x viewport height)
    if (cardRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInteractive(entry.isIntersecting);
        },
        { rootMargin: '50% 0px 50% 0px' }
      );
      observer.observe(cardRef.current);

      return () => {
        observer.disconnect();
        motionQuery.removeEventListener('change', handleMotionChange);
      };
    }
  }, []);

  // Choreographed Hover Forward Sequence
  const handleMouseEnter = async () => {
    setIsFlipped(true);
    if (prefersReducedMotion) {
      await controls.start({
        scale: 1.04,
        y: -12,
        boxShadow: `0 24px 60px ${accentShadowColor}`,
        transition: { duration: 0.15 }
      });
      return;
    }

    // Trigger lift and rotate concurrently
    await controls.start("flipped");
  };

  // Choreographed Hover Reverse Sequence
  const handleMouseLeave = async () => {
    setIsFlipped(false);
    if (prefersReducedMotion) {
      await controls.start({
        scale: 1,
        y: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: { duration: 0.15 }
      });
      return;
    }

    // Trigger rest transition instantly
    await controls.start("rest");
  };

  // Click handler for touch devices
  const handleCardClick = () => {
    if (isTouchDevice) {
      if (isFlipped) {
        handleMouseLeave();
      } else {
        handleMouseEnter();
      }
    }
  };

  // Keyboard navigation handles
  const handleFocus = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      handleMouseEnter();
    }
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      handleMouseLeave();
    }
  };

  // Framer Motion variants
  const variants = {
    rest: {
      scale: 1,
      y: 0,
      rotateY: 0,
      opacity: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      transition: {
        rotateY: { duration: 0.18, ease: "easeOut" },
        opacity: { duration: 0.18 },
        scale: { duration: 0.15, ease: "easeOut" },
        y: { duration: 0.15, ease: "easeOut" },
        boxShadow: { duration: 0.18 }
      }
    },
    lifted: {
      scale: 1.04,
      y: -12,
      rotateY: 0,
      opacity: 1,
      boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      transition: {
        scale: { duration: 0.12, ease: "easeOut" },
        y: { duration: 0.12, ease: "easeOut" },
        boxShadow: { duration: 0.12 }
      }
    },
    flipped: {
      scale: 1.04,
      y: -12,
      rotateY: 180,
      opacity: 1,
      boxShadow: `0 24px 60px ${accentShadowColor}`,
      transition: {
        rotateY: { duration: 0.18, ease: "easeOut" },
        opacity: { duration: 0.18 },
        y: { duration: 0.15, ease: "easeOut" },
        scale: { duration: 0.15, ease: "easeOut" },
        boxShadow: { duration: 0.18 }
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className="work-card-3d-wrapper"
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleCardClick}
      onMouseEnter={isInteractive && !isTouchDevice ? () => {
        handleMouseEnter();
        triggerHover(type === 'video' || type === 'reels' ? 'Play' : 'View');
      } : undefined}
      onMouseLeave={isInteractive && !isTouchDevice ? () => {
        handleMouseLeave();
        triggerDefault();
      } : undefined}
      aria-label={`Project card for ${title}. Hover or tap to see details.`}
      style={{
        '--card-accent-color': accentColor
      }}
    >
      <motion.div
        className="work-card-3d-inner"
        variants={variants}
        initial="rest"
        animate={controls}
        style={{
          willChange: 'transform, box-shadow'
        }}
      >
        {/* FRONT FACE */}
        <div 
          className="card-face-3d card-face-3d--front"
          style={{
            opacity: prefersReducedMotion && isFlipped ? 0 : 1,
            transition: prefersReducedMotion ? 'opacity 0.3s ease-in-out' : 'none'
          }}
        >
          {thumbnailImage ? (
            <RenderMedia imageStr={thumbnailImage} />
          ) : (
            <div className="front-media-placeholder">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-zinc-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}

          <div className="front-gradient-overlay" />
          <div className="category-tag-pill">{categoryLabel}</div>
          
          <div className="front-info">
            <h4 className="front-title">{title}</h4>
            <div className="arrow-icon-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          <div className="grain-overlay" />
          <span className="mobile-tap-hint">Tap for details</span>
        </div>

        {/* BACK FACE */}
        <div 
          className="card-face-3d card-face-3d--back"
          style={{
            opacity: prefersReducedMotion && !isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? 'auto' : 'none',
            transition: prefersReducedMotion ? 'opacity 0.3s ease-in-out' : 'none'
          }}
        >
          <div className="accent-top-border" />
          <div className="back-grid-overlay" />

          <div className="back-content">
            <div className="back-header">
              <span className="category-tag-pill--solid">{categoryLabel}</span>
              <h4 className="back-title">{title}</h4>
            </div>

            <div className="back-divider" />
            <p className="back-description">{description}</p>

            {tools.length > 0 && (
              <div className="tools-row">
                {tools.slice(0, 5).map((tool) => (
                  <span key={tool} className="tool-tag-pill">{tool}</span>
                ))}
              </div>
            )}

            <div className="back-footer">
              <div className="back-metadata">
                {organization && <span className="metadata-org">{organization}</span>}
                {date && <span className="metadata-date">{date}</span>}
              </div>

              {projectLink && (
                <a
                  href={projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="back-cta-btn"
                  onClick={(e) => e.stopPropagation()} // Stop click bubbling to toggle flip
                >
                  View Project
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="grain-overlay" />
        </div>
      </motion.div>
    </div>
  );
};
