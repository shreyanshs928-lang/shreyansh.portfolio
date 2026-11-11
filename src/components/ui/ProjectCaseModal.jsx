import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag, Briefcase, Wrench, Calendar } from 'lucide-react';
import ProjectImage from './ProjectImage';

export const ProjectCaseModal = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const category = project.tag || project.category || 'Creative Project';
  const tools = project.tools || (category.includes('UI') ? ['Figma', 'Prototyping', 'Design System'] :
    category.includes('Print') ? ['Adobe InDesign', 'Illustrator', 'Typesetting'] :
    category.includes('Video') || category.includes('Reel') ? ['Premiere Pro', 'After Effects', 'DaVinci'] :
    ['Illustrator', 'Figma', 'Grid System']);

  const liveLink = project.link || project.caseStudyUrl || 'https://behance.net';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm transition-all"
            aria-label="Close project modal"
          >
            <X size={20} />
          </button>

          {/* Project Media Visual */}
          <div className="relative w-full aspect-[16/10] sm:aspect-video bg-slate-50 border-b border-slate-100">
            <ProjectImage
              src={project.image || project.thumbnailImage}
              alt={project.title}
              category={category}
              aspectClass="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                {category}
              </span>
              {project.org && (
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {project.org}
                </span>
              )}
            </div>
          </div>

          {/* Content Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="display-font text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {project.desc || project.description || `A comprehensive design case study crafted by Shreyansh Singh for ${project.org || 'creative production'}. Exploring design systems, vector grids, and visual rhythm.`}
              </p>
            </div>

            {/* Scope / Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Tag size={12} className="text-indigo-500" /> Category
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{category}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Briefcase size={12} className="text-amber-500" /> Organization
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{project.org || 'IIT Bombay'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Calendar size={12} className="text-emerald-500" /> Year
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">2025 – 2026</span>
              </div>
            </div>

            {/* Tools Used */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Wrench size={14} className="text-indigo-500" /> Tools & Disciplines
              </span>
              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={onClose}
                className="btn btn-secondary text-xs sm:text-sm"
              >
                Back to Overview
              </button>

              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs sm:text-sm"
              >
                Open Full Project <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectCaseModal;

