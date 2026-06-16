import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';

// Vector SVG placeholder layouts
const placeholderSvgs = {
  'social-1': (
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
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
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
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
    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#1A1A1E"/>
      <path d="M 30 250 L 120 70 L 210 250 Z" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
      <path d="M 100 250 L 160 130 L 220 250 Z" stroke="#4F46E5" strokeWidth="1.5" strokeOpacity="0.6"/>
      <text x="30" y="60" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">INTER-IIT '26</text>
      <text x="30" y="82" fill="rgba(255,255,255,0.4)" fontFamily="Inter" fontSize="12">ATHLETICS CONTINGENT</text>
    </svg>
  ),
  'print-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
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
    <svg width="100%" height="100%" viewBox="0 0 350 375" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
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
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
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
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#1A1A1E"/><rect x="15" y="15" width="195" height="370" stroke="rgba(255,255,255,0.03)"/>
      <text x="30" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">01</text>
      <text x="30" y="105" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">IDEA</text>
      <text x="30" y="130" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">LAUNCH</text>
      <circle cx="112.5" cy="270" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
      <path d="M 112.5 220 A 50 50 0 0 1 162.5 270" stroke="#4F46E5" strokeWidth="3" fill="none"/>
    </svg>
  ),
  'reels-3': (
    <svg width="100%" height="100%" viewBox="0 0 225 400" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/><rect x="15" y="15" width="195" height="370" stroke="rgba(255,255,255,0.03)"/>
      <text x="30" y="60" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="16">STARTUP</text>
      <text x="30" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="16">COMMUNITY</text>
      <text x="30" y="100" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">INTERVIEW REELS</text>
      <path d="M 30 250 C 60 200, 90 300, 120 250 C 150 200, 180 300, 195 250" stroke="#4F46E5" strokeOpacity="0.6" strokeWidth="2" fill="none"/>
      <path d="M 30 250 C 60 220, 90 280, 120 250 C 150 220, 180 280, 195 250" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
    </svg>
  ),
  'video-1': (
    <svg width="100%" height="100%" viewBox="0 0 500 281" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#18181B"/><path d="M 0 140 Q 125 40 250 140 T 500 140" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none"/>
      <line x1="250" y1="0" x2="250" y2="281" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <path d="M 230 140 L 250 100 L 270 140" fill="#4F46E5" fillOpacity="0.3" stroke="#4F46E5" strokeWidth="1"/>
      <text x="40" y="50" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">ROCKET LAUNCH</text>
      <text x="40" y="72" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">TEST FLIGHT DOCUMENTARY</text>
    </svg>
  ),
  'video-2': (
    <svg width="100%" height="100%" viewBox="0 0 500 281" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#161619"/><rect x="50" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <rect x="200" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <rect x="350" y="40" width="100" height="200" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)"/>
      <circle cx="250" cy="140" r="40" fill="rgba(99, 102, 241, 0.1)" stroke="#4F46E5" strokeOpacity="0.3"/><text x="40" y="250" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">CAMPUS LIFE</text>
      <text x="40" y="265" fill="#4F46E5" fontFamily="Space Grotesk" fontWeight="600" fontSize="10">MINI DOCUMENTARY</text>
    </svg>
  ),
  'branding-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" className="card-media" xmlns="http://www.w3.org/2000/svg">
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

// Image/SVG renderer supporting both raw SVG string assets and standard file URLs
const RenderMedia = ({ imageStr }) => {
  if (!imageStr) return null;
  if (imageStr.startsWith('svg:')) {
    const key = imageStr.split(':')[1];
    return placeholderSvgs[key] || null;
  }
  return <img src={imageStr} className="card-media" alt="Project Media" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

// Individual Card Component with Hover & Magnetic bindings
const WorkCard = ({ project, index, type, isRevealed }) => {
  const cardRef = useRef(null);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const handleClick = (e) => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      ref={cardRef}
      className={`card glass-card darkroom-item ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        setMagneticElement(e.currentTarget);
        triggerHover(type === 'video' || type === 'reels' ? 'Play' : 'View');
      }}
      onMouseLeave={triggerDefault}
    >
      <div className="card-media-wrapper">
        <RenderMedia imageStr={project.image} />
        
        {/* Caption Overlay */}
        {project.desc && (
          <div className="card-overlay">
            <p className="overlay-caption">{project.desc}</p>
          </div>
        )}

        {/* Video Play Button Overlay */}
        {(type === 'video' || type === 'reels') && (
          <div className="play-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )}
      </div>

      <div className="card-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
          <h4 className="display-font">{project.title}</h4>
          <span className="card-tag">{project.tag}</span>
        </div>

        {/* Tools list badges */}
        {type === 'video' && project.tools && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {project.tools.map((t) => (
              <span key={t} className="card-tag" style={{ fontSize: '7px', opacity: 0.6 }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* UI case study buttons */}
        {type === 'ui' && project.caseStudyUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <a
              href={project.caseStudyUrl}
              className="case-study-link animate-draw-line"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Stop bubbling click
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Study');
              }}
              onMouseLeave={triggerDefault}
            >
              Case Study →
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

// Branding Showcase Card (Full-width custom layout)
const BrandingCard = ({ project, index, isRevealed }) => {
  const cardRef = useRef(null);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const handleClick = (e) => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      ref={cardRef}
      className={`card glass-card brand-card darkroom-item ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        setMagneticElement(e.currentTarget);
        triggerHover('Read');
      }}
      onMouseLeave={triggerDefault}
    >
      <div className="brand-card-visual">
        <RenderMedia imageStr={project.image} />
      </div>
      <div className="brand-card-info">
        <div>
          <span className="card-tag">{project.tag}</span>
          <h4 className="display-font" style={{ fontSize: '1.6rem', color: 'var(--text-white)', marginTop: '0.5rem', lineHeight: 1.2 }}>
            {project.title}
          </h4>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{project.desc}</p>
        
        <div className="brand-details-grid">
          <div className="brand-detail-item">
            <h4>Scope</h4>
            <p>{project.scope}</p>
          </div>
          <div className="brand-detail-item">
            <h4>Organization</h4>
            <p>{project.org}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

// Section Component wrapper
const WorkSection = ({ id, eyebrow, title, desc, viewAllLink = "https://behance.net", type, projects }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  // Filter out draft visibility items
  const publishedProjects = (projects || []).filter((p) => p.status !== 'draft');

  if (publishedProjects.length === 0) return null;

  return (
    <section ref={sectionRef} id={id} className={`work-section reveal-item ${isRevealed ? 'revealed' : ''} section-grid-overlay`}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--text-muted)' }}>{eyebrow}</span>
            <h3 className="display-font" style={{ fontSize: '1.8rem', color: 'var(--text-white)' }}>{title}</h3>
          </div>
          <a
            href={viewAllLink}
            className="view-all-link animate-draw-line"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Link');
            }}
            onMouseLeave={triggerDefault}
          >
            View All {title.split(' ')[0]} →
          </a>
        </div>

        {type === 'branding' ? (
          <div className="brand-showcase">
            {publishedProjects.map((p, idx) => (
              <BrandingCard key={p.id} project={p} index={idx} isRevealed={isRevealed} />
            ))}
          </div>
        ) : (
          <div className={`
            ${type === 'social' ? 'social-grid' : ''}
            ${type === 'print' ? 'print-grid' : ''}
            ${type === 'ui' ? 'ui-grid' : ''}
            ${type === 'reels' ? 'video-grid vertical-reels' : ''}
            ${type === 'video' ? 'video-grid' : ''}
          `}>
            {publishedProjects.map((p, idx) => (
              <WorkCard key={p.id} project={p} index={idx} type={type} isRevealed={isRevealed} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Core Work Page Component
export const Work = ({ portfolioData }) => {
  const sectionHeaderRef = useRef(null);
  const isHeaderRevealed = useFadeInOnScroll(sectionHeaderRef, { threshold: 0.15 });

  return (
    <div id="work">
      {/* SECTION MAIN HEADER */}
      <section ref={sectionHeaderRef} className={`reveal-item ${isHeaderRevealed ? 'revealed' : ''} section-grid-overlay`} style={{ paddingBottom: '2rem', borderBottom: 'none' }}>
        <div className="container">
          <span className="section-eyebrow">Portfolio</span>
          <h2 className="section-title display-font section-title-3d">Selected Works</h2>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            A deep dive into cross-disciplinary projects shipped for real products, festivals, and campus teams.
          </p>
        </div>
      </section>

      {/* 4a. Social Media Posts */}
      <WorkSection
        id="work-social"
        eyebrow="Social · Posts"
        title="Digital Campaigns"
        type="social"
        projects={portfolioData.work.social}
      />

      {/* 4b. Print Media */}
      <WorkSection
        id="work-print"
        eyebrow="Print · Editorial"
        title="Editorial & Layouts"
        type="print"
        projects={portfolioData.work.print}
      />

      {/* 4c. UI/UX Design */}
      <WorkSection
        id="work-ui"
        eyebrow="UI · UX · Web"
        title="Digital Platforms"
        type="ui"
        projects={portfolioData.work.ui}
      />

      {/* 4d. Reels & Motion */}
      <WorkSection
        id="work-reels"
        eyebrow="Reels · Motion"
        title="Short Form Motion"
        type="reels"
        projects={portfolioData.work.reels}
      />

      {/* 4e. Video Editing */}
      <WorkSection
        id="work-video"
        eyebrow="Video · Editing"
        title="Cinematics & Edits"
        type="video"
        projects={portfolioData.work.video}
      />

      {/* 4f. Branding & Identity */}
      <WorkSection
        id="work-branding"
        eyebrow="Brand · Identity"
        title="Identity Systems"
        type="branding"
        projects={portfolioData.work.branding}
      />
    </div>
  );
};
