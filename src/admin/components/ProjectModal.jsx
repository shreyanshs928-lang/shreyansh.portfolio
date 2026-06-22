import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { X, Plus } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, project, category, onSave }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [scope, setScope] = useState('');
  const [org, setOrg] = useState('');
  const [link, setLink] = useState('');
  const [caseStudyUrl, setCaseStudyUrl] = useState('');
  const [status, setStatus] = useState('published');
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [date, setDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Storing list of tools
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState('');

  // Debounced preview state
  const [previewProject, setPreviewProject] = useState({});

  // Update form state when project changes (for editing)
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setTag(project.tag || project.categoryLabel || '');
      setImage(project.image || project.thumbnailImage || '');
      setDesc(project.desc || project.description || '');
      setScope(project.scope || '');
      setOrg(project.org || project.organization || '');
      setLink(project.link || project.projectLink || '');
      setCaseStudyUrl(project.caseStudyUrl || project.caseStudyLink || '');
      setTools(project.tools || []);
      setStatus(project.status || 'published');
      setAccentColor(project.accentColor || '#8B5CF6');
      setDate(project.date || '');
      setIsFeatured(project.isFeatured || project.featured || project.activeByDefault || false);
    } else {
      // Clear forms for new entries
      setTitle('');
      setTag('');
      setImage(category === 'social' ? 'svg:social-1' : category === 'print' ? 'svg:print-1' : category === 'ui' ? 'svg:ui-1' : category === 'reels' ? 'svg:reels-1' : category === 'video' ? 'svg:video-1' : 'svg:branding-1');
      setDesc('');
      setScope('');
      setOrg('');
      setLink('');
      setCaseStudyUrl('');
      setTools([]);
      setStatus('published');
      setAccentColor('#8B5CF6');
      setDate('');
      setIsFeatured(false);
    }
  }, [project, category, isOpen]);

  // Debounce the preview data updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewProject({
        title: title.trim(),
        categoryLabel: tag.trim() || 'Project',
        tag: tag.trim() || 'Project',
        description: desc.trim(),
        desc: desc.trim(),
        accentColor: accentColor.trim(),
        tools,
        organization: org.trim(),
        org: org.trim(),
        date: date.trim(),
        projectLink: link.trim(),
        link: link.trim(),
        caseStudyLink: caseStudyUrl.trim(),
        caseStudyUrl: caseStudyUrl.trim()
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [title, tag, desc, accentColor, tools, org, date, link, caseStudyUrl]);

  if (!isOpen) return null;

  const isMoreThanFourLines = (text) => {
    if (!text) return false;
    const lines = text.split('\n');
    let totalLines = 0;
    for (const line of lines) {
      // Estimate line wrap on card back: width is 280px (approx 35 chars per line)
      totalLines += Math.max(1, Math.ceil(line.length / 35));
    }
    return totalLines > 4;
  };

  const handleAddTool = (e) => {
    if (e) e.preventDefault();
    const clean = toolInput.trim();
    if (!clean) return;
    if (tools.length >= 5) {
      alert('Maximum of 5 tools allowed.');
      return;
    }
    if (!tools.includes(clean)) {
      setTools([...tools, clean]);
    }
    setToolInput('');
  };

  const handleRemoveTool = (toolToRemove) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      alert('Project Title is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      tag: tag.trim() || 'Project',
      categoryLabel: tag.trim() || 'Project',
      image,
      thumbnailImage: image,
      status,
      isDraft: status === 'draft',
      isFeatured,
      featured: isFeatured,
      activeByDefault: isFeatured,
      accentColor: accentColor.trim(),
      desc: desc.trim(),
      description: desc.trim(),
      org: org.trim(),
      organization: org.trim(),
      date: date.trim(),
      link: link.trim(),
      projectLink: link.trim(),
      tools,
      scope: scope.trim()
    };

    if (project?.id) {
      payload.id = project.id;
      payload.orderIndex = project.orderIndex;
    } else {
      payload.id = 'proj-' + category + '-' + Date.now();
      payload.orderIndex = 999; // Added to end
    }

    // Add conditional UX case study details for UI/UX category
    if (category === 'ui') {
      payload.caseStudyUrl = caseStudyUrl.trim();
      payload.caseStudyLink = caseStudyUrl.trim();
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#27272a]">
          <h3 className="text-lg font-bold font-display text-white">
            {project ? 'Edit Project Details' : 'Add New Project'}
          </h3>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Two Column Layout container */}
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#27272a] overflow-hidden grow">
          
          {/* Left Panel: Inputs Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-7/12 p-6 overflow-y-auto space-y-4 max-h-[70vh]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Project Title</label>
                  <span className={`text-[10px] ${title.length >= 35 ? 'text-amber-500' : 'text-[#71717a]'}`}>
                    {title.length}/40
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={40}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Campaign Reveal"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Category Label</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Instagram Post"
                />
              </div>
            </div>

            {/* Accent Color picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Card Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-10 h-9 bg-transparent border border-[#27272a] rounded cursor-pointer p-0.5"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
                <input
                  type="text"
                  className="grow bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors uppercase"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            {/* Image/SVG media picker */}
            <ImageUploader
              section={`work-${category}`}
              value={image}
              onChange={setImage}
              placeholder={category === 'social' ? 'svg:social-1' : category === 'print' ? 'svg:print-1' : category === 'ui' ? 'svg:ui-1' : category === 'reels' ? 'svg:reels-1' : category === 'video' ? 'svg:video-1' : 'svg:branding-1'}
            />

            {/* Description textarea */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Description (Back Face)</label>
                <span className={`text-[10px] ${desc.length >= 180 ? 'text-amber-500' : 'text-[#71717a]'}`}>
                  {desc.length}/200
                </span>
              </div>
              <textarea
                maxLength={200}
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                style={{ minHeight: '80px' }}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Explain project details, features, or client parameters..."
              />
              {isMoreThanFourLines(desc) && (
                <p className="text-[10px] text-amber-500 font-medium mt-1">
                  ⚠️ Warning: Description exceeds 4 lines of text and may be truncated on the card back face.
                </p>
              )}
            </div>

            {/* Tools input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Tools Used</label>
                <span className="text-[10px] text-[#71717a]">{tools.length}/5 tags</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={tools.length >= 5}
                  className="grow bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors disabled:opacity-50"
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTool(e)}
                  placeholder={tools.length >= 5 ? "Max tools reached" : "e.g. Illustrator (Press Enter to add)"}
                />
                <button
                  type="button"
                  disabled={tools.length >= 5}
                  onClick={handleAddTool}
                  className="bg-[#27272a] border border-[#3f3f46] hover:bg-[#3f3f46] text-white p-2 rounded transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#4f46e5]/10 border border-[#4f46e5]/30 text-[#6366f1] px-2 py-0.5 rounded-full"
                  >
                    {t}
                    <button type="button" onClick={() => handleRemoveTool(t)} className="hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Date and Org details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Organization</label>
                <input
                  type="text"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. IIT Bombay"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Date / Duration</label>
                <input
                  type="text"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Jan 2025"
                />
              </div>
            </div>

            {/* Destination URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Project Destination URL</label>
              <input
                type="text"
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. https://behance.net/..."
              />
            </div>

            {/* UX Case Study URL for UI design */}
            {category === 'ui' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">UX Case Study URL</label>
                <input
                  type="text"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={caseStudyUrl}
                  onChange={(e) => setCaseStudyUrl(e.target.value)}
                  placeholder="e.g. https://behance.net/case-study-details"
                />
              </div>
            )}

            {/* Visibility & Featured Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex justify-between items-center p-3 bg-[#09090b]/60 border border-[#27272a] rounded">
                <div className="text-xs">
                  <p className="text-white font-medium">Visibility</p>
                  <p className="text-[#71717a] text-[10px]">Draft hides this card from the site.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    status === 'published' ? 'bg-[#6366f1]' : 'bg-[#27272a]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      status === 'published' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#09090b]/60 border border-[#27272a] rounded">
                <div className="text-xs">
                  <p className="text-white font-medium">Featured Status</p>
                  <p className="text-[#71717a] text-[10px]">Mark as featured project.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isFeatured ? 'bg-amber-500' : 'bg-[#27272a]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isFeatured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </form>

          {/* Right Panel: Live Card-Back Preview */}
          <div className="w-full md:w-5/12 p-6 bg-[#0c0c0e] flex flex-col items-center justify-center min-h-[400px] border-t md:border-t-0 border-[#27272a]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-6">
              Live Card-Back Preview
            </div>

            <div 
              className="work-card-3d-wrapper" 
              style={{ 
                transform: 'scale(0.85)', 
                transformOrigin: 'center center',
                '--card-accent-color': previewProject.accentColor || '#8B5CF6'
              }}
            >
              <div className="work-card-3d-inner" style={{ transform: 'rotateY(180deg)', transition: 'none' }}>
                <div className="card-face-3d card-face-3d--back" style={{ opacity: 1, pointerEvents: 'none', transition: 'none' }}>
                  <div className="accent-top-border" />
                  <div className="back-grid-overlay" />

                  <div className="back-content">
                    <div className="back-header">
                      <span className="category-tag-pill--solid">{previewProject.categoryLabel || 'Project'}</span>
                      <h4 className="back-title">{previewProject.title || 'Untitled Project'}</h4>
                    </div>

                    <div className="back-divider" />
                    <p className="back-description">{previewProject.description || 'No description provided.'}</p>

                    {previewProject.tools && previewProject.tools.length > 0 && (
                      <div className="tools-row">
                        {previewProject.tools.slice(0, 5).map((tool) => (
                          <span key={tool} className="tool-tag-pill">{tool}</span>
                        ))}
                      </div>
                    )}

                    <div className="back-footer">
                      <div className="back-metadata">
                        {previewProject.organization && <span className="metadata-org">{previewProject.organization}</span>}
                        {previewProject.date && <span className="metadata-date">{previewProject.date}</span>}
                      </div>

                      {previewProject.projectLink && (
                        <span className="back-cta-btn">
                          View Project
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grain-overlay" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#27272a] bg-[#18181b]">
          <button
            type="button"
            className="text-xs px-4 py-2 border border-[#27272a] rounded text-[#a1a1aa] hover:text-white transition-colors"
            onClick={onClose}
          >
            Discard
          </button>
          <button
            type="button"
            className="text-xs px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded transition-colors"
            onClick={handleSubmit}
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
}

