import React, { useRef, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { CursorContext } from '../../context/CursorContext';
import { ExternalLink, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';

export const WorkCard3D = ({ project, index = 0, onQuickView }) => {
  const cardRef = useRef(null);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const p = project || {};
  const category = p.tag || p.category || 'Featured Work';
  const liveLink = p.link || p.caseStudyUrl || 'https://behance.net';

  // 3D Perspective Tilt calculations
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6; // max 6 deg tilt
    const rY = ((x - centerX) / centerX) * 6;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    setMagneticElement(cardRef.current);
    triggerHover('Inspect');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    triggerDefault();
  };

  // Tools badges
  const tools = p.tools || (
    category.includes('UI') ? ['Figma', 'Systems'] :
    category.includes('Print') ? ['InDesign', 'Typography'] :
    category.includes('Video') || category.includes('Reel') ? ['Premiere', 'After Effects'] :
    ['Illustrator', 'Branding']
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="project-card-clean group relative cursor-pointer"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? 8 : 0}px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
      }}
      onClick={() => onQuickView && onQuickView(p)}
    >
      {/* Media Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        <ProjectImage
          src={p.image || p.thumbnailImage}
          alt={p.title || 'Project'}
          category={category}
          aspectClass="w-full h-full"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200/80 uppercase tracking-wider">
            {category}
          </span>
          {p.org && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {p.org}
            </span>
          )}
        </div>

        {/* Hover Quickview Overlay Action */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(p);
            }}
            className="btn btn-secondary text-xs px-3 py-1.5 rounded-full shadow-md font-bold"
          >
            <Eye size={13} /> Quick View
          </button>
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn btn-primary text-xs px-3 py-1.5 rounded-full shadow-md font-bold"
            >
              Open <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="display-font text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {p.title}
            </h3>
            <span className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {p.desc || p.description || `Design project crafted by Shreyansh Singh focusing on ${category} and clean visual execution.`}
          </p>
        </div>

        {/* Tools row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tools.slice(0, 2).map((tool, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
              >
                {tool}
              </span>
            ))}
          </div>

          <span className="text-[11px] font-bold text-indigo-600 group-hover:underline">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkCard3D;
