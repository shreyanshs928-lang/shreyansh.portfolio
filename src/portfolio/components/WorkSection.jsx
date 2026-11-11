import React, { useState, useMemo, useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { WorkCard3D } from './WorkCard3D';
import { ProjectCaseModal } from '../../components/ui/ProjectCaseModal';
import { 
  LayoutGrid, 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  Layers, 
  ExternalLink,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';

export const Work = ({ portfolioData, activeCategory: externalCategory, onCategoryChange }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.05 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const [internalCategory, setInternalCategory] = useState('all');
  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setActiveCategory = onCategoryChange || setInternalCategory;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'feed'

  // Flatten and normalize all projects from portfolioData.work
  const allProjects = useMemo(() => {
    const work = portfolioData?.work || {};
    const items = [];

    // 1. UI / UX
    (work.ui || []).forEach(p => items.push({ ...p, categoryGroup: 'ui', displayCategory: 'UI/UX & Telemetry' }));
    // 2. Branding
    (work.branding || []).forEach(p => items.push({ ...p, categoryGroup: 'brand', displayCategory: 'Brand Systems' }));
    // 3. Print
    (work.print || []).forEach(p => items.push({ ...p, categoryGroup: 'print', displayCategory: 'Print & Editorial' }));
    // 4. Video & Motion
    (work.video || []).forEach(p => items.push({ ...p, categoryGroup: 'video', displayCategory: 'Motion & Video' }));
    (work.reels || []).forEach(p => items.push({ ...p, categoryGroup: 'video', displayCategory: 'Motion & Video' }));
    // 5. Social Media
    (work.social || []).forEach(p => items.push({ ...p, categoryGroup: 'social', displayCategory: 'Digital Campaigns' }));

    // Remove duplicates by id and filter out drafts
    const unique = [];
    const seen = new Set();
    for (const item of items) {
      if (item.status !== 'draft' && !seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return unique;
  }, [portfolioData]);

  // Categories definitions
  const categories = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'ui', label: 'UI/UX & Telemetry', count: allProjects.filter(p => p.categoryGroup === 'ui').length },
    { id: 'brand', label: 'Brand Systems', count: allProjects.filter(p => p.categoryGroup === 'brand').length },
    { id: 'video', label: 'Motion & Video', count: allProjects.filter(p => p.categoryGroup === 'video').length },
    { id: 'print', label: 'Print & Editorial', count: allProjects.filter(p => p.categoryGroup === 'print').length },
    { id: 'social', label: 'Digital Campaigns', count: allProjects.filter(p => p.categoryGroup === 'social').length },
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchCat = activeCategory === 'all' || p.categoryGroup === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.org && p.org.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [allProjects, activeCategory, searchQuery]);

  const handleOpenQuickView = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section 
      ref={sectionRef} 
      id="work" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-white py-20 border-b border-slate-200/80`}
    >
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-eyebrow">Creative Portfolio</span>
            <h2 className="section-title">Selected Works</h2>
            <p className="section-desc">
              A curated collection of mission-critical dashboards, brand systems, kinetic videos, and print publications.
            </p>
          </div>

          {/* Controls: Search + View Switcher */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative flex-grow sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search projects, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>

            {/* View Mode Toggle: Grid vs Magazine Feed */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Grid View"
                title="Bento Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('feed')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'feed' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Feed View"
                title="Magazine Feed View"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-pill flex items-center gap-2 shrink-0 ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Display: Grid or Feed */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 rounded-3xl border border-slate-200/80">
            <p className="text-slate-500 text-base mb-3 font-medium">
              No projects found matching your search.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="btn btn-secondary text-xs rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <WorkCard3D
                key={project.id || idx}
                project={project}
                index={idx}
                onQuickView={handleOpenQuickView}
              />
            ))}
          </div>
        ) : (
          /* Magazine Feed View */
          <div className="space-y-6">
            {filteredProjects.map((project) => {
              const category = project.tag || project.category || 'Featured Work';
              const tools = project.tools || (
                category.includes('UI') ? ['Figma', 'Systems'] :
                category.includes('Print') ? ['InDesign', 'Typography'] :
                category.includes('Video') || category.includes('Reel') ? ['Premiere', 'After Effects'] :
                ['Illustrator', 'Branding']
              );

              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenQuickView(project)}
                  className="glass-card p-6 sm:p-8 bg-white flex flex-col md:flex-row items-center gap-8 cursor-pointer group hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  {/* Media Viewport */}
                  <div className="w-full md:w-80 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative">
                    <ProjectImage
                      src={project.image || project.thumbnailImage}
                      alt={project.title}
                      category={category}
                      aspectClass="w-full h-full"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase">
                      {category}
                    </span>
                  </div>

                  {/* Content Info */}
                  <div className="flex-grow space-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="display-font text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                        {project.org && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {project.org}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {project.desc || project.description || `Design project crafted by Shreyansh Singh focusing on ${category} and clean visual execution.`}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {tools.map((t, i) => (
                          <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenQuickView(project);
                        }}
                        className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                      >
                        <Eye size={14} /> Quick View Case Study
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Behance Callout Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Want to see more comprehensive case studies?
            </span>
            <h3 className="display-font text-xl sm:text-2xl font-bold">
              Explore 50+ Shipped Creative Works on Behance
            </h3>
          </div>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gradient px-6 py-3 rounded-full text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Behance');
            }}
            onMouseLeave={triggerDefault}
          >
            <span>Visit Behance Profile</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Quickview Case Study Modal */}
      <ProjectCaseModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Work;
