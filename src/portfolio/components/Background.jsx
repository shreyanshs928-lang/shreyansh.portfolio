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
    <section ref={sectionRef} id="background" className="background-section section-grid-overlay" style={{ position: 'relative', isolation: 'isolate', zIndex: 0 }}>
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
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Edu');
            }}
            onMouseLeave={triggerDefault}
          >
            <span
              className="card-tag"
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2.5rem',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              Academic
            </span>
            <h3 className="edu-title display-font">{degree}</h3>
            <p className="edu-inst">{institution}</p>
            <span className="edu-year">{year}</span>
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
