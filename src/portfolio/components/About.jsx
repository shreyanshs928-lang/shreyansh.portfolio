import React, { useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { gpuLayer } from '../../utils/motionProps';

export const About = ({ profileData }) => {
  const containerRef = useRef(null);
  const isRevealed = useFadeInOnScroll(containerRef, { threshold: 0.15 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const paragraph = profileData?.about?.paragraph || "";
  const profilePhoto = profileData?.about?.profilePhoto || "";
  const stats = profileData?.about?.stats || [];

  // Framer Motion spring physics for stat pills
  const statsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const statPillVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [0.8, 1.06, 1],
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 180,
        duration: 0.6
      }
    }
  };

  const renderPhotoOrIllustration = () => {
    if (!profilePhoto || profilePhoto.startsWith('svg:')) {
      // Return custom SVG blueprint placeholder
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#131316' }}>
          <defs>
            <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </linearGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          <circle cx="200" cy="200" r="120" fill="url(#svgGrad)" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="4 4"/>
          <circle cx="200" cy="200" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
          <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1"/>
          <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
          <rect x="195" y="75" width="10" height="10" fill="#4F46E5" />
          <rect x="195" y="315" width="10" height="10" fill="#4F46E5" />
          <rect x="75" y="195" width="10" height="10" fill="#4F46E5" />
          <rect x="315" y="195" width="10" height="10" fill="#4F46E5" />
          <path d="M 140 140 L 260 260 M 260 140 L 140 260" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
          <circle cx="140" cy="140" r="14" fill="#131316" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <text x="135" y="145" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" fontSize="12">H</text>
          <circle cx="260" cy="260" r="14" fill="#131316" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <text x="254" y="265" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" fontSize="12">C</text>
          <circle cx="200" cy="200" r="20" fill="#0B0B0C" stroke="#4F46E5" strokeWidth="2"/>
          <text x="193" y="206" fill="#FFFFFF" fontFamily="Space Grotesk" fontWeight="bold" fontSize="18">S</text>
        </svg>
      );
    } else {
      // Render the uploaded photo
      return (
        <img
          src={profilePhoto}
          alt="Shreyansh Singh"
          style={{ width: '100%', height: '100%', objectCover: 'cover', display: 'block', borderRadius: '4px' }}
        />
      );
    }
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className={`reveal-item ${isRevealed ? 'revealed' : ''} section-grid-overlay`}
      style={{ position: 'relative', isolation: 'isolate', zIndex: 0 }}
    >
      <div className="container">
        <div className="about-grid glass-card p-8 md:p-12">
          
          <div className="about-left">
            <span className="section-eyebrow">Brief</span>
            <h2 className="section-title display-font section-title-3d">About Me</h2>
            <p className="section-desc">Who I am and what drives my work.</p>
            
            <p
              className="about-paragraph"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
            
            {/* Framer motion staggered spring stat pills */}
            <motion.div
              {...gpuLayer}
              className="about-stats"
              variants={statsContainerVariants}
              initial="hidden"
              animate={isRevealed ? "visible" : "hidden"}
            >
              {stats.map((stat, idx) => (
                <motion.div
                  {...gpuLayer}
                  key={idx}
                  className="stat-pill"
                  variants={statPillVariants}
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Read');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  <span></span>
                  {stat}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div
            className="about-right"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '200ms'
            }}
          >
            <div className="about-illustration">
              {renderPhotoOrIllustration()}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
