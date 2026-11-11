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
  Table,
  Eye
} from 'lucide-react';

export const Work = ({ portfolioData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.05 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 shadow-sm"
            />
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

        {/* Projects Grid */}
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
        ) : (
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
