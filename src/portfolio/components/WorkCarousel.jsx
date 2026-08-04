import React, { useState, useEffect, useRef } from 'react';
import { useDirectionalHover } from '../../hooks/useCursor';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';
import Carousel from '../../components/ui/Carousel';

const CarouselCard = ({ item, isFeatured }) => {
  const { ref, style } = useDirectionalHover('Open');
  const cItem = item || {};

  const renderThumbnail = () => {
    return (
      <ProjectImage
        src={cItem.thumbnailImage}
        alt={cItem.title || 'Project Thumbnail'}
        category={cItem.category || 'Featured Work'}
        aspectClass="h-[220px]"
      />
    );
  };

  return (
    <div 
      ref={ref}
      style={{ ...style, display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', userSelect: 'none' }}
      className="carousel-card flex-shrink-0 w-[280px] md:w-[350px]"
    >
      <div style={{ position: 'relative' }}>
        {renderThumbnail()}
        {isFeatured && (
          <span className="featured-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--accent-amber)', color: '#ffffff', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(255, 138, 76, 0.3)' }}>
            Featured
          </span>
        )}
      </div>
      
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: 'var(--accent-violet)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {cItem.category || 'Featured Work'}
          </span>
          <h3 className="display-font" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '6px', marginBottom: '10px' }}>
            {cItem.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>
            {cItem.description}
          </p>
        </div>

        {cItem.link && (
          <a 
            href={cItem.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary" 
            style={{ padding: '10px 16px', fontSize: '0.8rem', width: '100%', gap: '8px', borderRadius: '10px' }}
          >
            Launch Project <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export const WorkCarousel = ({ carouselData }) => {
  if (!carouselData || carouselData.length === 0) return null;

  return (
    <section id="work" className="section-grid-overlay" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="section-eyebrow">Work</span>
            <h2 className="section-title display-font section-title-3d">Selected Works</h2>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              Interact and explore a carousel of featured design systems, interfaces, and campaigns.
            </p>
          </div>
        </div>

        <Carousel className="w-full">
          {carouselData.map((item) => (
            <CarouselCard 
              key={item.id} 
              item={item} 
              isFeatured={item.activeByDefault} 
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
};
