import React, { useState, useRef, useContext } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';

const CarouselCard = ({ item }) => {
  const cItem = item || {};
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  return (
    <div 
      className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-[300px] sm:w-[360px] shrink-0"
      onMouseEnter={(e) => {
        setMagneticElement(e.currentTarget);
        triggerHover('Featured');
      }}
      onMouseLeave={triggerDefault}
    >
      <div className="relative aspect-[16/10] bg-slate-50 border-b border-slate-100">
        <ProjectImage
          src={cItem.thumbnailImage}
          alt={cItem.title || 'Project'}
          category={cItem.category || 'Featured Work'}
          aspectClass="w-full h-full"
        />
        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          Featured
        </span>
      </div>
      
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            {cItem.category || 'Creative Project'}
          </span>
          <h3 className="display-font text-lg sm:text-xl font-bold text-slate-900 mb-2">
            {cItem.title}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
            {cItem.description}
          </p>
        </div>

        {cItem.link && (
          <a
            href={cItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-xs py-2 px-4 rounded-xl w-full"
          >
            <span>Launch Case Study</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
};

export const WorkCarousel = ({ carouselData }) => {
  const scrollRef = useRef(null);
  const items = carouselData || [];

  if (items.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="bg-slate-50/60 py-16 border-b border-slate-200/80 overflow-hidden">
      <div className="container mb-8 flex items-end justify-between">
        <div>
          <span className="section-eyebrow">Spotlight</span>
          <h2 className="section-title text-2xl sm:text-3xl font-bold">Featured Highlights</h2>
          <p className="section-desc text-sm">
            Top cross-disciplinary releases shipped for student bodies, rocketry competitions, and festivals.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="container">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x"
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start">
              <CarouselCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkCarousel;
