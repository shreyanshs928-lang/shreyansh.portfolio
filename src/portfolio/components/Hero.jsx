import React, { useEffect, useState, useContext, useRef } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { useMousePosition } from '../../context/MousePositionContext';
import { Linkedin, Instagram, Mail } from 'lucide-react';

export const Hero = ({ heroData, isLoading }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsLoaded(true), 150);
      return () => clearTimeout(timer);
    }
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

  const { x, y, rawX, rawY, isSupported } = useMousePosition();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 0, glowY: 0 });

  // Sync latest coordinates to ref to prevent animation frame teardowns
  useEffect(() => {
    mouseCoords.current = { rawX, rawY, x };
  }, [rawX, rawY, x]);

  // RequestAnimationFrame spotlight tracker loop
  useEffect(() => {
    if (!isSupported || !heroRef.current) return;

    let animId;

    const updateSpotlight = () => {
      if (!spotlightRef.current || !heroRef.current) {
        animId = requestAnimationFrame(updateSpotlight);
        return;
      }

      const rect = heroRef.current.getBoundingClientRect();
      const targetX = mouseCoords.current.rawX - rect.left;
      const targetY = mouseCoords.current.rawY - rect.top;

      // Smooth lerp (12% catch-up factor)
      spotlightPos.current.x += (targetX - spotlightPos.current.x) * 0.12;
      spotlightPos.current.y += (targetY - spotlightPos.current.y) * 0.12;

      const spotlightEl = spotlightRef.current;
      spotlightEl.style.transform = `translate3d(${spotlightPos.current.x}px, ${spotlightPos.current.y}px, 0)`;

      // Dynamic color interpolation: Violet (139, 92, 246) -> Amber (255, 138, 76)
      const t = (mouseCoords.current.x + 1) / 2;
      const r = Math.round(139 + (255 - 139) * t);
      const g = Math.round(92 + (138 - 92) * t);
      const b = Math.round(246 + (76 - 246) * t);

      spotlightEl.style.setProperty('--spotlight-color', `rgba(${r}, ${g}, ${b}, 0.12)`);

      animId = requestAnimationFrame(updateSpotlight);
    };

    animId = requestAnimationFrame(updateSpotlight);
    return () => cancelAnimationFrame(animId);
  }, [isSupported]);

  const handleCardMouseMove = (e) => {
    if (!isSupported || !portraitRef.current) return;

    const rect = portraitRef.current.getBoundingClientRect();
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

    setTilt({ rotateX, rotateY, glowX, glowY });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 0, glowY: 0 });
  };

  if (isLoading) {
    // High-fidelity inline skeleton loading layout to prevent layout shifts
    return (
      <section id="hero" style={{ overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '8rem 0 4rem 0' }}>
        <div className="container hero-wrapper w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Skeleton */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              {/* Eyebrow */}
              <div className="h-4 w-28 bg-zinc-800/60 rounded animate-pulse mb-6" />
              {/* Headline Line 1 */}
              <div className="h-12 w-[85%] bg-zinc-800/60 rounded animate-pulse mb-3" />
              {/* Headline Line 2 */}
              <div className="h-12 w-[65%] bg-zinc-800/60 rounded animate-pulse mb-8" />
              {/* Bio Paragraph Lines */}
              <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-zinc-800/60 rounded animate-pulse" />
                <div className="h-4 w-[95%] bg-zinc-800/60 rounded animate-pulse" />
                <div className="h-4 w-[75%] bg-zinc-800/60 rounded animate-pulse" />
              </div>
              {/* CTA & Socials */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="h-12 w-48 bg-zinc-800/60 rounded-full animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 bg-zinc-800/60 rounded-full animate-pulse" />
                  <div className="h-11 w-11 bg-zinc-800/60 rounded-full animate-pulse" />
                  <div className="h-11 w-11 bg-zinc-800/60 rounded-full animate-pulse" />
                  <div className="h-11 w-11 bg-zinc-800/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-[340px] aspect-square bg-zinc-800/60 rounded-[16px] animate-pulse relative">
                {/* Optional badge placeholder */}
                <div className="absolute -bottom-3 -right-3 h-10 w-44 bg-zinc-800/80 border border-zinc-700/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Marquee Ticker Skeleton */}
          <div className="h-8 w-full bg-zinc-800/40 rounded animate-pulse mt-16 lg:mt-24" />

          {/* Stats Row Skeleton */}
          <div className="mt-12 pt-10 border-t border-[#27272a]/20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col text-left space-y-2">
                <div className="h-10 w-20 bg-zinc-800/60 rounded animate-pulse" />
                <div className="h-3 w-28 bg-zinc-800/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const eyebrowText = heroData?.eyebrowText || "Hey, I'm Shreyansh";
  const headlineLine1 = heroData?.headlineLine1 || "Multidisciplinary Designer +";
  const headlineLine2 = heroData?.headlineLine2 || "Chemical Engineer";
  const bioText = heroData?.bioText || "";
  const resumeLink = heroData?.resumeLink || "#";
  const badgeText = heroData?.badgeText || "";
  const portraitImage = heroData?.portraitImage || "";
  const stats = heroData?.stats || [];
  const disciplines = heroData?.ticker || [];
  const socialLinksData = heroData?.socialLinks || {};

  const socialLinks = [
    { icon: <Linkedin size={20} />, url: socialLinksData.linkedin, label: 'LinkedIn' },
    { icon: <Instagram size={20} />, url: socialLinksData.instagram, label: 'Instagram' },
    { icon: <BehanceIcon />, url: socialLinksData.behance, label: 'Behance' },
    { icon: <Mail size={20} />, url: socialLinksData.email ? `mailto:${socialLinksData.email}` : null, label: 'Email' }
  ];

  const deltaX = typeof window !== 'undefined' ? rawX - window.innerWidth / 2 : 0;
  const deltaY = typeof window !== 'undefined' ? rawY - window.innerHeight / 2 : 0;

  return (
    <section ref={heroRef} id="hero" style={{ overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '8rem 0 4rem 0', position: 'relative' }}>
      {/* 3D Parallax Ambient Background System */}
      <div className="ambient-lighting-container">
        {/* Layer 1 (5% Speed): Blurred Blobs */}
        <div 
          className="ambient-blob-layer"
          style={{
            transform: isSupported ? `translate3d(${deltaX * 0.05}px, ${deltaY * 0.05}px, 0)` : 'none'
          }}
        >
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
        </div>

        {/* Layer 2 (12% Speed): Geometric Grid */}
        <div 
          className="ambient-grid-layer"
          style={{
            transform: isSupported ? `translate3d(${deltaX * 0.12}px, ${deltaY * 0.12}px, 0)` : 'none'
          }}
        />

        {/* Layer 3 (25% Speed): Spotlight wrapper */}
        <div 
          className="ambient-spotlight-layer"
          style={{
            transform: isSupported ? `translate3d(${deltaX * 0.25}px, ${deltaY * 0.25}px, 0)` : 'none'
          }}
        >
          <div ref={spotlightRef} className="ambient-spotlight" />
        </div>
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
                transform: isSupported ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` : 'none',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Background ambient glow pulse with shifting transform */}
              <div 
                className="ambient-glow-pulse"
                style={{
                  transform: isSupported ? `translate3d(${tilt.glowX}px, ${tilt.glowY}px, 0)` : 'none',
                  transition: 'transform 0.3s ease-out'
                }}
              ></div>

              {/* Rotating Gradient Frame */}
              <div className="rotating-gradient-border aspect-square w-full">
                <div className="w-full h-full bg-[#0A0E1A] rounded-[15px] overflow-hidden flex items-center justify-center p-1.5">
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

        {/* Disciplines Marquee Ticker */}
        {disciplines.length > 0 && (
          <div 
            className="hero-marquee-container mt-16 lg:mt-24 will-animate"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 1s ease',
              transitionDelay: '800ms'
            }}
          >
            <div className="hero-marquee-track">
              {disciplines.concat(disciplines).map((disc, idx) => (
                <div key={idx} className="hero-marquee-item">
                  <span style={{ color: 'var(--accent-amber)', marginRight: '6px' }}>·</span> {disc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Stats Row at bottom */}
        {stats && stats.length > 0 && (
          <div 
            className="mt-12 pt-10 border-t border-[#27272a]/20 grid grid-cols-2 md:grid-cols-4 gap-6 will-animate"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '900ms'
            }}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col text-left">
                <span className="text-3xl md:text-4xl font-extrabold gradient-text display-font mb-1 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold font-sans">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
