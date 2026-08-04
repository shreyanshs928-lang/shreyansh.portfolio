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

    const matches = value.match(/\d+/);
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

  const floatDelay = `${(delay % 1000) / 100}s`;

  return (
    <div 
      ref={cardRef}
      className="flex flex-col text-left glass-card p-5 transition-all duration-1000"
      style={{
        transform: isVisible ? 'rotateY(0deg)' : 'rotateY(15deg)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        animation: isVisible ? 'floatStatCard 3s ease-in-out infinite alternate' : 'none',
        animationDelay: floatDelay
      }}
    >
      <span className="text-3xl md:text-4xl font-extrabold gradient-text display-font mb-1 tracking-tight">
        {displayValue}
      </span>
      <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold font-sans">
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
  const bioText = heroData?.bioText || "";
  const resumeLink = heroData?.resumeLink || "#";
  const badgeText = heroData?.badgeText || "";
  const portraitImage = heroData?.portraitImage || "";
  const stats = heroData?.stats || [];
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
    <section ref={heroRef} id="hero" style={{ display: 'flex', alignItems: 'center', padding: '6rem 0 4rem 0', position: 'relative', isolation: 'isolate', zIndex: 0 }} className="section-grid-overlay">
      {/* 3D Parallax Ambient Background System */}
      <div className="ambient-lighting-container">
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

      {/* 3D Floating Background Geometric Shapes */}
      <div className="floating-shapes-layer">
        {/* Shape 1: Cube wireframe behind photo */}
        <div className="cube-wrapper sm:right-[10%] lg:right-[15%] top-[20%]">
          <div className="cube-wireframe">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face left"></div>
            <div className="face right"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>

        {/* Shape 2: Tilted spinning Torus behind headline */}
        <div className="torus-shape top-[20%] left-[5%]" />

        {/* Shape 3: Scattered light dust particles */}
        <div className="dust-particle violet" />
        <div className="dust-particle amber" />
        <div className="dust-particle white" />
        <div className="dust-particle violet" />
        <div className="dust-particle amber" />
      </div>

      <div className="container hero-wrapper w-full relative z-10">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span 
              className="section-eyebrow will-animate"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '50ms'
              }}
            >
              {eyebrowText}
            </span>

            <h1 className="display-font text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
              <span className="block overflow-hidden pb-1">
                <span
                  className="block will-animate"
                  style={{
                    transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '100ms'
                  }}
                >
                  {headlineLine1}
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span
                  className="block gradient-text will-animate"
                  style={{
                    transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '300ms'
                  }}
                >
                  {headlineLine2}
                </span>
              </span>
            </h1>

            <p
              className="hero-subhead will-animate text-base md:text-lg text-zinc-400 font-sans leading-relaxed max-w-[620px] mb-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '500ms'
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
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '550ms'
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
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '650ms'
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
              transform: isLoaded ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '200ms'
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
                    <div className="w-full h-full flex items-center justify-center text-[#8B5CF6] opacity-60 bg-[#121829] rounded-[11px]">
                      <svg className="w-24 h-24 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
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
                    transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.9)',
                    transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '950ms'
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
          <div className="mt-12 pt-10 border-t border-[#27272a]/20 grid grid-cols-2 md:grid-cols-4 gap-6">
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
