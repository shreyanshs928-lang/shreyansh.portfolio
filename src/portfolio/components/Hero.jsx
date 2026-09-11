import React, { useEffect, useState, useContext, useRef } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { useMousePosition } from '../../context/MousePositionContext';
import { Linkedin, Instagram, Mail } from 'lucide-react';

const AnimatedStatCard = ({ value, label, delay }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (entry.target) observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (!value || typeof value !== 'string') {
      setDisplayValue(value || '');
      return;
    }

    // Only count-up animate values that start with a number (e.g. "1+", "6+", "3")
    // Non-numeric labels (e.g. "IIT Bombay '27") should display immediately without rolling
    const matches = value.match(/^\d+/);
    if (!matches) {
      setDisplayValue(value);
      return;
    }

    const endVal = parseInt(matches[0], 10);
    const prefix = value.substring(0, value.indexOf(matches[0]));
    const suffix = value.substring(value.indexOf(matches[0]) + matches[0].length);

    let startTimestamp = null;
    const duration = 1200; // 1.2s

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * endVal);
      
      setDisplayValue(`${prefix}${currentVal}${suffix}`);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const timer = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  const isLongText = (value || '').length > 8;

  return (
    <div 
      ref={cardRef}
      className="flex flex-col text-left glass-card p-4 sm:p-5 justify-between min-h-[90px]"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        transitionDelay: `${Math.min(delay, 200)}ms`
      }}
    >
      <span className={`${isLongText ? 'text-lg sm:text-xl md:text-2xl leading-snug' : 'text-3xl md:text-4xl leading-tight'} font-extrabold gradient-text display-font mb-1 tracking-tight break-words`}>
        {displayValue}
      </span>
      <span className="text-[10px] md:text-xs text-slate-300 uppercase tracking-widest font-bold font-sans">
        {label}
      </span>
    </div>
  );
};

export const Hero = ({ heroData, isLoading }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const { setMagneticElement, triggerHover, triggerDefault, cursorType } = useContext(CursorContext);
  const cursorTypeRef = useRef(cursorType);

  useEffect(() => {
    cursorTypeRef.current = cursorType;
  }, [cursorType]);

  useEffect(() => {
    setIsLoaded(true);
  }, [isLoading]);

  // Behance icon component
  const BehanceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
      <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
      <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
      <line x1="14" y1="7" x2="19" y2="7"/>
    </svg>
  );

  const heroRef = useRef(null);
  const spotlightRef = useRef(null);
  const portraitRef = useRef(null);
  const spotlightPos = useRef({ x: 0, y: 0 });
  const mouseCoords = useRef({ rawX: 0, rawY: 0, x: 0 });

  const [isSupported, setIsSupported] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const blobLayerRef = useRef(null);
  const gridLayerRef = useRef(null);
  const spotlightLayerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }
  }, []);

  useEffect(() => {
    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      
      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', handleChange);
      } else {
        motionQuery.addListener(handleChange);
      }
      return () => {
        if (motionQuery.removeEventListener) {
          motionQuery.removeEventListener('change', handleChange);
        } else {
          motionQuery.removeListener(handleChange);
        }
      };
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Sync latest coordinates to ref to prevent animation frame teardowns and context subscription renders
  useEffect(() => {
    if (!isSupported) return;

    const handleMouseMove = (e) => {
      const w = window.innerWidth;
      mouseCoords.current = {
        rawX: e.clientX,
        rawY: e.clientY,
        x: w > 0 ? (e.clientX - w / 2) / (w / 2) : 0
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isSupported]);

  // RequestAnimationFrame spotlight tracker loop
  useEffect(() => {
    if (!isSupported || !heroRef.current) return;

    let animId;
    let cachedOffsetTop = 0;
    let cachedOffsetLeft = 0;

    const updateOffsets = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        cachedOffsetTop = rect.top + window.scrollY;
        cachedOffsetLeft = rect.left + window.scrollX;
      }
    };

    updateOffsets();
    window.addEventListener('resize', updateOffsets);

    const updateSpotlight = () => {
      if (!spotlightRef.current || !heroRef.current) {
        animId = requestAnimationFrame(updateSpotlight);
        return;
      }

      const isHover = cursorTypeRef.current === 'hover';
      // Viewport-relative offset calculated using cached absolute coordinates and scroll values
      // This completely avoids getBoundingClientRect() inside the frame loop, eliminating layout thrashing
      const targetX = mouseCoords.current.rawX - (cachedOffsetLeft - window.scrollX);
      const targetY = mouseCoords.current.rawY - (cachedOffsetTop - window.scrollY);

      // Smooth lerp (12% catch-up factor, or 100% for reduced motion)
      const lerpFactor = prefersReducedMotion ? 1.0 : 0.12;
      spotlightPos.current.x += (targetX - spotlightPos.current.x) * lerpFactor;
      spotlightPos.current.y += (targetY - spotlightPos.current.y) * lerpFactor;

      const spotlightEl = spotlightRef.current;
      spotlightEl.style.transform = `translate3d(${spotlightPos.current.x}px, ${spotlightPos.current.y}px, 0)`;

      // Parallax layers transform updates directly on DOM elements
      if (!prefersReducedMotion) {
        const deltaX = mouseCoords.current.rawX - window.innerWidth / 2;
        const deltaY = mouseCoords.current.rawY - window.innerHeight / 2;

        if (blobLayerRef.current) {
          blobLayerRef.current.style.transform = `translate3d(${deltaX * 0.05}px, ${deltaY * 0.05}px, 0)`;
        }
        if (gridLayerRef.current) {
          gridLayerRef.current.style.transform = `translate3d(${deltaX * 0.12}px, ${deltaY * 0.12}px, 0)`;
        }
        if (spotlightLayerRef.current) {
          spotlightLayerRef.current.style.transform = `translate3d(${deltaX * 0.25}px, ${deltaY * 0.25}px, 0)`;
        }
      }

      // Dynamic color interpolation: Violet -> Amber
      const t = (mouseCoords.current.x + 1) / 2;
      const rStart = isHover ? 168 : 139;
      const rEnd = isHover ? 249 : 255;
      const gStart = isHover ? 85 : 92;
      const gEnd = isHover ? 115 : 138;
      const bStart = isHover ? 247 : 246;
      const bEnd = isHover ? 22 : 76;

      const r = Math.round(rStart + (rEnd - rStart) * t);
      const g = Math.round(gStart + (gEnd - gStart) * t);
      const b = Math.round(bStart + (bEnd - bStart) * t);

      const opacity = isHover ? 0.38 : 0.13;
      const scale = prefersReducedMotion ? 1.0 : (isHover ? 1.2 : 1.0);

      spotlightEl.style.setProperty('--spotlight-color', `rgba(${r}, ${g}, ${b}, 1)`);
      spotlightEl.style.opacity = opacity;
      spotlightEl.style.scale = scale;

      animId = requestAnimationFrame(updateSpotlight);
    };

    animId = requestAnimationFrame(updateSpotlight);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateOffsets);
    };
  }, [isSupported, prefersReducedMotion, isLoading]);

  const handleCardMouseMove = (e) => {
    if (!isSupported || prefersReducedMotion || !portraitRef.current) return;

    const el = portraitRef.current;
    const rect = el.getBoundingClientRect();
    const cardX = e.clientX - rect.left;
    const cardY = e.clientY - rect.top;

    const normCardX = (cardX - rect.width / 2) / (rect.width / 2);
    const normCardY = (cardY - rect.height / 2) / (rect.height / 2);

    // Max 3D tilt: ±6 degrees
    const rotateY = normCardX * 6;
    const rotateX = -normCardY * 6;

    // Shift background glow opposite to tilt (max ±12px)
    const glowX = -normCardX * 12;
    const glowY = -normCardY * 12;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    const glowEl = el.querySelector('.ambient-glow-pulse');
    if (glowEl) {
      glowEl.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    }
  };

  const handleCardMouseLeave = () => {
    if (!portraitRef.current) return;
    const el = portraitRef.current;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    
    const glowEl = el.querySelector('.ambient-glow-pulse');
    if (glowEl) {
      glowEl.style.transform = 'translate3d(0, 0, 0)';
    }
  };

  const eyebrowText = heroData?.eyebrowText || "Hey, I'm Shreyansh";
  const headlineLine1 = heroData?.headlineLine1 || "Multidisciplinary Designer +";
  const headlineLine2 = heroData?.headlineLine2 || "Chemical Engineer";
  const bioText = heroData?.bioText || "I design across UI/UX, motion, print and social — blending an engineer's precision with a designer's instinct. Currently building creative systems at IIT Bombay.";
  const resumeLink = heroData?.resumeLink || "https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing";
  const badgeText = heroData?.badgeText || "Self-Taught Designer";
  const portraitImage = heroData?.portraitImage || "svg:avatar";
  const fallbackStats = [
    { value: '2+', label: 'Years Designing' },
    { value: '10+', label: 'Projects Shipped' },
    { value: '6', label: 'Disciplines' },
    { value: "IIT Bombay '27", label: 'Student Core' }
  ];
  const stats = (heroData?.stats && heroData.stats.length > 0) ? heroData.stats : fallbackStats;
  const socialLinksData = heroData?.socialLinks || {};

  const fallbackTags = [
    { label: 'Creative Direction', color: 'violet' },
    { label: 'UI/UX Layouts', color: 'violet' },
    { label: 'Motion & Video', color: 'violet' },
    { label: 'Brand Systems', color: 'amber' },
    { label: 'Editorial Design', color: 'amber' },
    { label: 'Print Media', color: 'amber' },
    { label: 'Social Content', color: 'neutral' }
  ];
  const tags = heroData?.disciplineTags && heroData.disciplineTags.length > 0
    ? heroData.disciplineTags
    : fallbackTags;
  const row1Tags = tags.slice(0, 3);
  const row2Tags = tags.slice(3, 8);

  const socialLinks = [
    { icon: <Linkedin size={20} />, url: socialLinksData.linkedin, label: 'LinkedIn' },
    { icon: <Instagram size={20} />, url: socialLinksData.instagram, label: 'Instagram' },
    { icon: <BehanceIcon />, url: socialLinksData.behance, label: 'Behance' },
    { icon: <Mail size={20} />, url: socialLinksData.email ? `mailto:${socialLinksData.email}` : null, label: 'Email' }
  ];
  return (
    <section
      ref={heroRef}
      id="hero"
      data-section="hero"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'center',
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: '#070B18',
        isolation: 'isolate',
        zIndex: 0,
        overflow: 'hidden',
        contain: 'paint',
        padding: '6rem 0 2rem 0'
      }}
      className="section-grid-overlay"
    >
      {/* 3D Parallax Ambient Background System */}
      <div 
        className="ambient-lighting-container"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#070B18',
          zIndex: 0,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'paint'
        }}
      >
        {/* Layer 1 (5% Speed): Blurred Blobs */}
        <div className="ambient-blob-layer" ref={blobLayerRef}>
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
        </div>

        {/* Layer 2 (12% Speed): Geometric Grid */}
        <div className="ambient-grid-layer" ref={gridLayerRef} />

        {/* Layer 3 (25% Speed): Spotlight wrapper */}
        <div className="ambient-spotlight-layer" ref={spotlightLayerRef}>
          <div ref={spotlightRef} className="ambient-spotlight" />
        </div>
      </div>

      <div className="container hero-wrapper w-full relative z-10">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content with Fractal Glass Plate */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left hero-text-fractal-plate">
            <span 
              className="section-eyebrow will-animate"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
              }}
            >
              {eyebrowText}
            </span>

            <h1 className="display-font text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
              <span className="block">
                {headlineLine1}
              </span>
              <span className="block gradient-text">
                {headlineLine2}
              </span>
            </h1>

            <p
              className="hero-subhead will-animate text-base md:text-lg text-slate-200 font-sans leading-relaxed max-w-[620px] mb-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                transitionDelay: '80ms'
              }}
            >
              {bioText}
            </p>

            {/* Static Staggered Tag Cloud */}
            {tags.length > 0 && (
              <div 
                className="hero-tag-cloud will-animate"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                  transitionDelay: '120ms'
                }}
              >
                {/* Row 1: slightly left-offset */}
                <div className="flex flex-wrap gap-2.5 pl-2">
                  {row1Tags.map((tag, idx) => (
                    <div key={idx} className={`glass-chip chip-${tag.color || 'neutral'}`}>
                      {tag.label}
                    </div>
                  ))}
                </div>
                {/* Row 2: slightly right-offset, smaller text */}
                <div className="flex flex-wrap gap-2.5 pl-6">
                  {row2Tags.map((tag, idx) => (
                    <div key={idx} className={`glass-chip chip-${tag.color || 'neutral'} text-[10px]`}>
                      {tag.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="hero-ctas will-animate flex items-center gap-5 flex-wrap"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                transitionDelay: '160ms'
              }}
            >
              <a
                href={resumeLink}
                className="btn btn-secondary"
                style={{ borderRadius: '9999px', padding: '0.75rem 2rem' }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Resume');
                }}
                onMouseLeave={triggerDefault}
              >
                Download Resume
              </a>
              <div className="flex items-center gap-3">
                {socialLinks.map((link, idx) => link.url ? (
                  <a
                    key={idx}
                    href={link.url}
                    className="social-circle-btn"
                    target={link.label !== 'Email' ? "_blank" : undefined}
                    rel={link.label !== 'Email' ? "noopener noreferrer" : undefined}
                    aria-label={link.label}
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover(link.label);
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    {link.icon}
                  </a>
                ) : null)}
              </div>
            </div>
          </div>

          {/* Right Column: Glowing Portrait Frame with 3D Tilt */}
          <div 
            className="lg:col-span-5 flex justify-center items-center relative will-animate"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'scale(1)' : 'scale(0.98)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
              transitionDelay: '80ms'
            }}
          >
            <div 
              ref={portraitRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative w-full max-w-[320px] sm:max-w-[340px]"
              style={{
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Background ambient glow pulse with shifting transform */}
              <div 
                className="ambient-glow-pulse"
                style={{
                  transition: 'transform 0.3s ease-out'
                }}
              ></div>

              {/* Rotating Gradient Frame */}
              <div className="rotating-gradient-border aspect-square w-full">
                <div className="w-full h-full bg-[var(--bg-base)] rounded-[15px] overflow-hidden flex items-center justify-center p-1.5">
                  {portraitImage && !portraitImage.startsWith('svg:') ? (
                    <img 
                      src={portraitImage} 
                      alt="Shreyansh Singh" 
                      className="w-full h-full object-cover rounded-[11px]" 
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-br from-[#0c101c] via-[#070B18] to-[#121626] rounded-[11px] overflow-hidden p-6 select-none border border-white/[0.04]">
                      {/* Concentric orbital rings and grid lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="85" stroke="#8B5CF6" strokeWidth="0.75" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="60" stroke="#8B5CF6" strokeWidth="0.75" opacity="0.6" />
                        <circle cx="100" cy="100" r="35" stroke="#FF8A4C" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.7" />
                        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
                        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
                        <circle cx="100" cy="15" r="2" fill="#8B5CF6" />
                        <circle cx="100" cy="185" r="2" fill="#8B5CF6" />
                        <circle cx="15" cy="100" r="2" fill="#FF8A4C" />
                        <circle cx="185" cy="100" r="2" fill="#FF8A4C" />
                      </svg>

                      {/* Centered Monogram / Minimal Geometric Avatar */}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 via-[#161B2E] to-[#FF8A4C]/20 border border-white/10 flex items-center justify-center shadow-inner mb-3">
                          <span className="display-font text-3xl font-extrabold tracking-wider gradient-text">
                            SS
                          </span>
                        </div>
                        <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium">
                          SHREYANSH SINGH
                        </span>
                        <span className="text-[9px] font-mono tracking-wider text-[#8B5CF6]/80 mt-0.5">
                          DESIGN × SYSTEMS
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Badge overlapping portrait */}
              {badgeText && (
                <div
                  className="absolute -bottom-3 -right-3 bg-[#141416]/95 border border-[#8B5CF6]/30 px-4 py-2.5 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-2 will-animate"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
                    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                    transitionDelay: '200ms'
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF8A4C] animate-pulse"></span>
                  <span className="text-[10px] md:text-xs font-semibold display-font tracking-wider text-white uppercase">{badgeText}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Stats Row at bottom with countUp and staggered tilt */}
        {stats && stats.length > 0 && (
          <div 
            className="mt-12 pt-8 border-t border-[#27272a]/20 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{
              position: 'relative',
              zIndex: 1,
              minHeight: '88px',
              backgroundColor: '#070B18',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              alignItems: 'center'
            }}
          >
            {stats.map((stat, idx) => (
              <AnimatedStatCard 
                key={idx}
                value={stat.value}
                label={stat.label}
                delay={idx * 120} // Staggered 120ms
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
