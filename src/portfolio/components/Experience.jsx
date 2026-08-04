import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';

export const Experience = ({ experienceData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  return (
    <section ref={sectionRef} id="experience" className="experience-section section-grid-overlay" style={{ position: 'relative', isolation: 'isolate', zIndex: 0 }}>
      <div className="container">
        <div className="section-header-reveal" style={{ marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Timeline</span>
          <h2 className="section-title display-font section-title-3d">Work Experience</h2>
        </div>

        <div className="experience-container">
          {/* Animated vertical timeline line */}
          <div
            className="experience-line will-animate"
            style={{
              transform: isRevealed ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {(Array.isArray(experienceData) ? experienceData : []).map((exp, idx) => (
            <article
              key={idx}
              className="experience-entry will-animate"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateX(0)' : 'translateX(40px)',
                filter: isRevealed ? 'blur(0)' : 'blur(4px)',
                transition: `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms, filter 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms`
              }}
              onMouseEnter={(e) => {
                // Focus state on cursor
                triggerHover('Detail');
              }}
              onMouseLeave={triggerDefault}
            >
              {/* Timeline dot */}
              <div className="experience-dot" />

              <div className="experience-header">
                <h3 className="experience-role display-font">
                  {exp.role} <span className="experience-company">· {exp.company}</span>
                </h3>
                <span className="experience-duration">{exp.duration}</span>
              </div>

              <ul className="experience-list">
                {(exp.points || []).map((pt, pIdx) => (
                  <li key={pIdx} className="experience-item">
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
