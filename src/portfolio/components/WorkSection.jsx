import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { WorkCard3D } from './WorkCard3D';

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

        <div className="work-grid-unified">
          {publishedProjects.map((p, idx) => (
            <WorkCard3D key={p.id} project={p} index={idx} type={type} />
          ))}
        </div>
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
