import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const Carousel = ({ children, className = '' }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [dragLimit, setDragLimit] = useState(0);
  const [dragX, setDragX] = useState(0);

  const updateBounds = () => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxDrag = Math.max(0, trackWidth - containerWidth);
      setDragLimit(maxDrag);
    }
  };

  useEffect(() => {
    updateBounds();
    const handleResize = () => updateBounds();
    window.addEventListener('resize', handleResize);

    let observer;
    if (trackRef.current && window.ResizeObserver) {
      observer = new ResizeObserver(() => updateBounds());
      observer.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [children]);

  const scrollLeft = () => {
    setDragX((prev) => Math.min(0, prev + 360));
  };

  const scrollRight = () => {
    setDragX((prev) => Math.max(-dragLimit, prev - 360));
  };

  return (
    <div className={`carousel-wrapper relative w-full ${className}`} style={{ width: '100%' }}>
      {/* Optional navigation arrows */}
      <div
        className="carousel-controls flex justify-end gap-3 mb-4"
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}
      >
        <button
          onClick={scrollLeft}
          className="carousel-btn prev-btn"
          aria-label="Previous items"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#12172A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={scrollRight}
          className="carousel-btn next-btn"
          aria-label="Next items"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#12172A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Drag container */}
      <div
        ref={containerRef}
        className="carousel-container overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          overflow: 'hidden',
          width: '100%',
          touchAction: 'pan-y'
        }}
      >
        <motion.div
          ref={trackRef}
          className="carousel-track flex gap-6"
          drag="x"
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.08}
          animate={{ x: dragX }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            display: 'flex',
            gap: '24px',
            width: 'max-content',
            willChange: 'transform'
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
