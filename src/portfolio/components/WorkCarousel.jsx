import React, { useState, useEffect, useRef } from 'react';
import { useDirectionalHover } from '../../hooks/useCursor';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

const CarouselCard = ({ item, isFeatured }) => {
  const { ref, style } = useDirectionalHover('Open');
  
  // Use uploaded image or fallback to custom SVG vector placeholders
  const isSvgPlaceholder = !item.thumbnailImage || item.thumbnailImage.startsWith('svg:');

  const renderThumbnail = () => {
    if (isSvgPlaceholder) {
      return (
        <div className="carousel-card-placeholder" style={{ background: '#171720', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="1.5" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      );
    }
    return (
      <div className="carousel-card-img-wrapper" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={item.thumbnailImage} 
          alt={item.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
          className="carousel-card-img"
        />
      </div>
    );
  };

  return (
    <div 
      ref={ref}
      style={{ ...style, display: 'flex', flexDirection: 'column', flex: '0 0 350px', background: 'var(--bg-elevated)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', userSelect: 'none' }}
      className="carousel-card"
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
            {item.category}
          </span>
          <h3 className="display-font" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '6px', marginBottom: '10px' }}>
            {item.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>
            {item.description}
          </p>
        </div>

        {item.link && (
          <a 
            href={item.link} 
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
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      // Snap to featured item on mount
      const items = Array.isArray(carouselData) ? carouselData : [];
      const featuredIndex = items.findIndex(item => item?.activeByDefault);
      if (featuredIndex !== -1) {
        const cardWidth = 350 + 24; // width + gap
        el.scrollTo({ left: featuredIndex * cardWidth, behavior: 'smooth' });
      }
    }
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [carouselData]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 374; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => handleScroll('left')} 
              disabled={!canScrollLeft}
              className={`carousel-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={() => handleScroll('right')} 
              disabled={!canScrollRight}
              className={`carousel-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="carousel-track" 
          style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {carouselData.map((item) => (
            <CarouselCard 
              key={item.id} 
              item={item} 
              isFeatured={item.activeByDefault} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
