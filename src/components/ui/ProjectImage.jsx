import React, { useState } from 'react';

const categoryVectorFallbacks = {
  'UI/UX Design': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#121624' }}>
      <rect width="100%" height="100%" fill="#121624"/>
      <rect x="20" y="20" width="360" height="185" rx="8" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1"/>
      <circle cx="45" cy="40" r="4" fill="#EF4444"/>
      <circle cx="60" cy="40" r="4" fill="#F59E0B"/>
      <circle cx="75" cy="40" r="4" fill="#10B981"/>
      <line x1="20" y1="55" x2="380" y2="55" stroke="rgba(255, 255, 255, 0.08)"/>
      <rect x="40" y="75" width="120" height="110" rx="6" fill="rgba(99, 102, 241, 0.1)" stroke="rgba(99, 102, 241, 0.2)"/>
      <rect x="180" y="75" width="180" height="24" rx="4" fill="rgba(255, 255, 255, 0.06)"/>
      <rect x="180" y="110" width="140" height="16" rx="4" fill="rgba(255, 255, 255, 0.04)"/>
      <rect x="180" y="135" width="160" height="16" rx="4" fill="rgba(255, 255, 255, 0.04)"/>
      <rect x="180" y="160" width="90" height="24" rx="4" fill="#4F46E5"/>
    </svg>
  ),
  'Print & Layout': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#13141C' }}>
      <rect width="100%" height="100%" fill="#13141C"/>
      <rect x="60" y="25" width="130" height="175" rx="4" fill="#1A1C28" stroke="rgba(255, 255, 255, 0.1)"/>
      <rect x="210" y="25" width="130" height="175" rx="4" fill="#1A1C28" stroke="rgba(255, 255, 255, 0.1)"/>
      <line x1="80" y1="50" x2="170" y2="50" stroke="#8B5CF6" strokeWidth="2"/>
      <line x1="80" y1="70" x2="160" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <line x1="80" y1="85" x2="150" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="80" y="105" width="90" height="70" fill="rgba(139, 92, 246, 0.15)"/>
      <line x1="230" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <line x1="230" y1="65" x2="310" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <rect x="230" y="85" width="90" height="90" fill="rgba(255,255,255,0.04)"/>
    </svg>
  ),
  'Motion & Video': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0F1322' }}>
      <rect width="100%" height="100%" fill="#0F1322"/>
      <circle cx="200" cy="112" r="45" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M 193 97 L 215 112 L 193 127 Z" fill="#F59E0B"/>
      <path d="M 40 180 Q 120 140 200 180 T 360 180" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" fill="none"/>
    </svg>
  ),
  'Brand & Identity': (
    <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#161224' }}>
      <rect width="100%" height="100%" fill="#161224"/>
      <polygon points="200,45 270,165 130,165" fill="none" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="200" cy="125" r="30" fill="rgba(236, 72, 153, 0.15)" stroke="#EC4899" strokeWidth="1"/>
      <text x="200" y="195" textAnchor="middle" fill="#EC4899" fontFamily="Space Grotesk" fontWeight="700" fontSize="12" letterSpacing="0.1em">SYSTEM</text>
    </svg>
  )
};

const defaultVectorFallback = (
  <svg width="100%" height="100%" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#121526' }}>
    <rect width="100%" height="100%" fill="#121526"/>
    <path d="M 0 225 L 150 100 L 230 160 L 320 70 L 400 150 L 400 225 Z" fill="rgba(99, 102, 241, 0.1)"/>
    <circle cx="300" cy="60" r="20" fill="rgba(255, 255, 255, 0.05)"/>
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

  const isSvgPlaceholder = !src || src.startsWith('svg:') || hasError;

  const renderFallback = () => {
    return categoryVectorFallbacks[category] || defaultVectorFallback;
  };

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
      {isLoading && !isSvgPlaceholder && (
        <div
          className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-[#161B26] via-[#22293A] to-[#161B26]"
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

      {isSvgPlaceholder ? (
        renderFallback()
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
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
