import React, { useState, useEffect } from 'react';

// Specific high-fidelity project SVGs matching the portfolio items
const placeholderSvgs = {
  'ui-2': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0D111A' }}>
      <rect width="100%" height="100%" fill="#0D111A"/>
      <rect x="20" y="20" width="360" height="185" rx="8" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1"/>
      <line x1="20" y1="52" x2="380" y2="52" stroke="rgba(255, 255, 255, 0.08)"/>
      <circle cx="36" cy="36" r="3.5" fill="#EF4444"/>
      <circle cx="48" cy="36" r="3.5" fill="#F59E0B"/>
      <circle cx="60" cy="36" r="3.5" fill="#10B981"/>
      <text x="75" y="40" fill="#9CA3AF" fontFamily="Space Grotesk, monospace" fontSize="10" fontWeight="600">AETHER TELEMETRY · FLIGHT CONTROL</text>
      
      {/* Radar / Attitude Indicator */}
      <circle cx="110" cy="125" r="50" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1"/>
      <circle cx="110" cy="125" r="32" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1"/>
      <line x1="110" y1="70" x2="110" y2="180" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1"/>
      <line x1="55" y1="125" x2="165" y2="125" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1"/>
      <line x1="110" y1="125" x2="135" y2="100" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="135" cy="100" r="3" fill="#FF8A4C"/>

      {/* Metrics Cards */}
      <rect x="180" y="68" width="90" height="52" rx="6" fill="#141926" stroke="rgba(255, 255, 255, 0.05)"/>
      <text x="190" y="85" fill="#6B7280" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600">APOGEE ALT</text>
      <text x="190" y="106" fill="#F3F4F6" fontFamily="Space Grotesk, monospace" fontSize="13" fontWeight="700">10,420 FT</text>

      <rect x="280" y="68" width="90" height="52" rx="6" fill="#141926" stroke="rgba(255, 255, 255, 0.05)"/>
      <text x="290" y="85" fill="#6B7280" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600">VELOCITY</text>
      <text x="290" y="106" fill="#8B5CF6" fontFamily="Space Grotesk, monospace" fontSize="13" fontWeight="700">MACH 1.12</text>

      {/* Graph line */}
      <path d="M 180 175 L 210 160 L 245 168 L 290 142 L 325 148 L 370 130" stroke="#FF8A4C" strokeWidth="2" fill="none"/>
      <circle cx="370" cy="130" r="3" fill="#FF8A4C"/>
      <line x1="180" y1="185" x2="370" y2="185" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1"/>
    </svg>
  ),
  'branding-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#111422' }}>
      <rect width="100%" height="100%" fill="#111422"/>
      <rect x="20" y="20" width="360" height="185" rx="8" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1"/>
      
      {/* Grid Construction Lines */}
      <circle cx="200" cy="105" r="58" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
      <circle cx="200" cy="105" r="36" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1"/>
      <line x1="120" y1="105" x2="280" y2="105" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3"/>
      <line x1="200" y1="40" x2="200" y2="170" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3"/>
      
      {/* Stylized Logo mark */}
      <path d="M 168 140 L 200 65 L 232 140" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 182 110 L 218 110" stroke="#FF8A4C" strokeWidth="3" strokeLinecap="round"/>
      
      <text x="200" y="172" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="15" letterSpacing="0.12em">ALUMINATION</text>
      <text x="200" y="187" textAnchor="middle" fill="rgba(255, 255, 255, 0.45)" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="0.18em">IIT BOMBAY ALUMNI CELL</text>
    </svg>
  ),
  'print-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0F121C' }}>
      <rect width="100%" height="100%" fill="#0F121C"/>
      
      {/* Booklet Spread */}
      <rect x="50" y="24" width="145" height="175" rx="3" fill="#161B28" stroke="rgba(255, 255, 255, 0.08)"/>
      <rect x="205" y="24" width="145" height="175" rx="3" fill="#161B28" stroke="rgba(255, 255, 255, 0.08)"/>
      
      {/* Left Page (Text / Content) */}
      <text x="65" y="52" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="11">01. PROPULSION</text>
      <line x1="65" y1="62" x2="175" y2="62" stroke="#8B5CF6" strokeWidth="1.5"/>
      
      <rect x="65" y="76" width="115" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.1)"/>
      <rect x="65" y="88" width="100" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.08)"/>
      <rect x="65" y="100" width="110" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.08)"/>
      <rect x="65" y="112" width="85" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.08)"/>
      
      {/* Schematic on left */}
      <rect x="65" y="132" width="115" height="50" rx="3" fill="rgba(139, 92, 246, 0.08)" stroke="rgba(139, 92, 246, 0.2)"/>
      <circle cx="122" cy="157" r="14" stroke="#8B5CF6" strokeOpacity="0.4" strokeWidth="1"/>

      {/* Right Page (Graphic Hero) */}
      <rect x="220" y="42" width="115" height="75" rx="3" fill="#1D2436"/>
      <circle cx="277" cy="79" r="24" fill="rgba(255, 138, 76, 0.15)" stroke="#FF8A4C" strokeWidth="1"/>
      
      <text x="220" y="145" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="13">AETHER</text>
      <text x="220" y="160" fill="#FF8A4C" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" letterSpacing="0.1em">SCIENTIFIC JOURNAL · VOL 04</text>
      <text x="220" y="185" fill="rgba(255, 255, 255, 0.25)" fontFamily="Space Grotesk, monospace" fontSize="7">PAGE 24-25</text>
    </svg>
  ),
  'ui-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0F121C' }}>
      <rect width="100%" height="100%" fill="#0F121C"/>
      <rect x="20" y="20" width="360" height="185" rx="8" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1"/>
      <rect x="20" y="20" width="70" height="185" fill="#141926"/>
      <circle cx="55" cy="45" r="14" fill="#8B5CF6"/>
      <rect x="35" y="75" width="40" height="6" rx="2" fill="rgba(255, 255, 255, 0.1)"/>
      <rect x="35" y="90" width="40" height="6" rx="2" fill="rgba(255, 255, 255, 0.1)"/>
      <text x="110" y="52" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="14">E-CELL INCUBATOR PORTAL</text>
      <rect x="110" y="75" width="115" height="55" rx="6" fill="#151A28" stroke="rgba(255, 255, 255, 0.05)"/>
      <text x="122" y="96" fill="#9CA3AF" fontSize="8">REGISTERED STARTUPS</text>
      <text x="122" y="118" fill="#FFFFFF" fontFamily="Space Grotesk" fontSize="16" fontWeight="700">120+</text>
      <rect x="240" y="75" width="125" height="55" rx="6" fill="#151A28" stroke="rgba(255, 255, 255, 0.05)"/>
      <text x="252" y="96" fill="#9CA3AF" fontSize="8">APPLICATIONS</text>
      <text x="252" y="118" fill="#FF8A4C" fontFamily="Space Grotesk" fontSize="16" fontWeight="700">1,420+</text>
    </svg>
  ),
  'print-2': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#13141C' }}>
      <rect width="100%" height="100%" fill="#13141C"/>
      <rect x="40" y="25" width="320" height="175" rx="6" fill="#1A1C28" stroke="rgba(255, 255, 255, 0.1)"/>
      <text x="70" y="75" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="20">MOOD INDIGO</text>
      <text x="70" y="98" fill="#8B5CF6" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.1em">FESTIVAL SCHEDULE GUIDE</text>
      <line x1="70" y1="115" x2="330" y2="115" stroke="rgba(255, 255, 255, 0.08)"/>
      <rect x="70" y="130" width="100" height="50" rx="4" fill="rgba(139, 92, 246, 0.1)" stroke="rgba(139, 92, 246, 0.2)"/>
      <rect x="185" y="130" width="145" height="50" rx="4" fill="#141724" stroke="rgba(255, 255, 255, 0.05)"/>
    </svg>
  ),
  'social-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
      <rect width="100%" height="100%" fill="#131316"/>
      <rect x="50" y="20" width="300" height="185" rx="6" stroke="#4F46E5" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="80" y="75" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="24">MOOD INDIGO '25</text>
      <text x="80" y="105" fill="#8B5CF6" fontFamily="Space Grotesk" fontWeight="600" fontSize="13">THEME REVEAL CAMPAIGN</text>
      <circle cx="280" cy="140" r="40" fill="rgba(99, 102, 241, 0.15)" stroke="#4F46E5" strokeWidth="1"/>
      <path d="M 265 140 Q 280 115 295 140 Q 280 165 265 140" stroke="#FFFFFF" fill="none"/>
    </svg>
  ),
  'social-2': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#141724' }}>
      <rect width="100%" height="100%" fill="#141724"/>
      <text x="70" y="80" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="22">E-SUMMIT SPEAKER LINEUP</text>
      <text x="70" y="105" fill="#FF8A4C" fontFamily="Inter" fontSize="11" fontWeight="600">KEYNOTE ANNOUNCEMENTS</text>
      <rect x="70" y="125" width="90" height="30" fill="#8B5CF6" rx="4"/>
      <text x="85" y="145" fill="#FFFFFF" fontFamily="Inter" fontWeight="600" fontSize="10">E-CELL IITB</text>
    </svg>
  ),
  'video-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#10131E' }}>
      <rect width="100%" height="100%" fill="#10131E"/>
      <circle cx="200" cy="112" r="36" fill="rgba(255, 138, 76, 0.15)" stroke="#FF8A4C" strokeWidth="1.5"/>
      <path d="M 194 100 L 212 112 L 194 124 Z" fill="#FF8A4C"/>
      <text x="200" y="175" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="700" fontSize="13">ROCKET LAUNCH TEST VLOG</text>
      <text x="200" y="192" textAnchor="middle" fill="#9CA3AF" fontFamily="Inter" fontSize="9">DOCUMENTARY EDIT</text>
    </svg>
  )
};

// Normalized category vector illustration fallbacks
const categoryVectorFallbacks = {
  'ui': placeholderSvgs['ui-2'],
  'ui/ux': placeholderSvgs['ui-2'],
  'ui/ux design': placeholderSvgs['ui-2'],
  'brand': placeholderSvgs['branding-1'],
  'branding': placeholderSvgs['branding-1'],
  'brand identity': placeholderSvgs['branding-1'],
  'brand & identity': placeholderSvgs['branding-1'],
  'print': placeholderSvgs['print-1'],
  'print & layout': placeholderSvgs['print-1'],
  'print media': placeholderSvgs['print-1'],
  'motion': placeholderSvgs['video-1'],
  'video': placeholderSvgs['video-1'],
  'motion & video': placeholderSvgs['video-1'],
  'social': placeholderSvgs['social-1'],
  'social media': placeholderSvgs['social-1'],
  'social content': placeholderSvgs['social-1']
};

const defaultVectorFallback = (
  <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0D111A' }}>
    <rect width="100%" height="100%" fill="#0D111A"/>
    <rect x="20" y="20" width="360" height="185" rx="8" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1"/>
    <path d="M 40 180 L 140 100 L 220 150 L 300 80 L 360 140" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" fill="none"/>
    <circle cx="300" cy="80" r="4" fill="#FF8A4C"/>
    <text x="200" y="195" textAnchor="middle" fill="#9CA3AF" fontFamily="Space Grotesk" fontSize="10">DESIGN SYSTEM</text>
  </svg>
);

export const ProjectImage = ({
  src,
  alt = 'Project Image',
  category = 'UI/UX Design',
  aspectClass = 'aspect-video',
  className = '',
  style = {}
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const normalizedCategory = (category || '').toLowerCase().trim();
  const isSvgScheme = typeof src === 'string' && src.startsWith('svg:');
  const svgKey = isSvgScheme ? src.split(':')[1] : '';

  const renderFallback = () => {
    // 1. If explicit svg:key matches
    if (svgKey && placeholderSvgs[svgKey]) {
      return placeholderSvgs[svgKey];
    }
    // 2. Try normalized category lookup
    if (categoryVectorFallbacks[normalizedCategory]) {
      return categoryVectorFallbacks[normalizedCategory];
    }
    // 3. Partial keyword matching
    for (const [key, vector] of Object.entries(categoryVectorFallbacks)) {
      if (normalizedCategory.includes(key)) {
        return vector;
      }
    }
    return defaultVectorFallback;
  };

  const showFallback = !src || isSvgScheme || hasError;

  return (
    <div
      className={`project-image-wrapper relative overflow-hidden bg-[#0D111A] ${aspectClass} ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        isolation: 'isolate',
        ...style
      }}
    >
      {/* Shimmer loading skeleton */}
      {isLoading && !showFallback && (
        <div
          className="absolute inset-0 z-10 animate-pulse"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'linear-gradient(90deg, #121726 0%, #1D2438 50%, #121726 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}

      {showFallback ? (
        renderFallback()
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export default ProjectImage;
