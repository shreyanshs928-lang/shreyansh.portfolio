import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';

export const Skills = ({ skillsData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const { tools = [], other = [] } = skillsData || {};

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="skills-section section-grid-overlay" 
      style={{ 
        position: 'relative', 
        isolation: 'isolate', 
        zIndex: 0,
        backgroundColor: 'transparent',
        contain: 'paint'
      }}
    >
      <div className="container">
        <div className="section-header-reveal" style={{ marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title display-font section-title-3d">Skills & Tools</h2>
        </div>

        <div className="skills-grid">
          {/* Column 1: Design Tools */}
          <div>
            <h3 className="skills-column-title display-font">Design & Tech Stack</h3>
            <div className="skills-pills glass-card p-6">
              {tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="skill-pill will-animate"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'scale(1)' : 'scale(0.85)',
                    transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms, background-color 0.3s, border-color 0.3s, color 0.3s, transform 0.3s`
                  }}
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Stack');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Other Skills / Disciplines */}
          <div>
            <h3 className="skills-column-title display-font">Disciplines & Specialties</h3>
            <div className="skills-pills glass-card p-6">
              {other.map((skill, idx) => (
                <div
                  key={idx}
                  className="skill-pill will-animate"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'scale(1)' : 'scale(0.85)',
                    // Offset the delay of the second column slightly so they ripple across
                    transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(idx * 50) + 150}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(idx * 50) + 150}ms, background-color 0.3s, border-color 0.3s, color 0.3s, transform 0.3s`
                  }}
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Skill');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
