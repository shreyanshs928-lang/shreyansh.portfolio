import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { Award } from 'lucide-react';

export const Background = ({ backgroundData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const { degree, institution, year, philosophy, achievements = [] } = backgroundData || {};

  return (
    <section 
      ref={sectionRef} 
      id="background" 
      className="background-section section-grid-overlay" 
      style={{ 
        position: 'relative', 
        isolation: 'isolate', 
        zIndex: 0,
        contain: 'paint'
      }}
    >
      <div className="container">
        <div className="section-header-reveal" style={{ marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Academic & Creed</span>
          <h2 className="section-title display-font section-title-3d">Background</h2>
        </div>

        <div className="background-content">
          {/* Left Block: Education Card */}
          <div
            className="edu-block will-animate"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px'
            }}
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Edu');
            }}
            onMouseLeave={triggerDefault}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(109, 40, 217, 0.08)', 
                    border: '1px solid rgba(109, 40, 217, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6D28D9'
                  }}
                >
                  <Award size={24} />
                </div>
                <span
                  className="card-tag"
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-violet)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}
                >
                  Academic Background
                </span>
              </div>
              <h3 className="edu-title display-font" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>{degree}</h3>
              <p className="edu-inst" style={{ fontSize: '1rem', color: '#4B5563', marginBottom: '1rem' }}>{institution}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span className="edu-year" style={{ fontWeight: 600, color: '#6D28D9' }}>{year}</span>
              <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Undergraduate Degree</span>
            </div>
          </div>

          {/* Right Block: Philosophy and Achievements */}
          <div
            className="bg-note-box will-animate"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 150ms'
            }}
          >
            {philosophy && (
              <blockquote className="bg-note-text">
                {philosophy}
              </blockquote>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              {achievements.map((ach, idx) => (
                <div key={idx} className="achievement-item">
                  <span className="achievement-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Award size={16} strokeWidth={2.5} />
                  </span>
                  <p className="achievement-text">{ach}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
