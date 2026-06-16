import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSWRConfig } from 'swr';
import {
  fetchPortfolioData,
  saveHero,
  saveAbout,
  saveSkills,
  saveBackground,
  saveFooter,
  saveExperience,
  saveWorkProject,
  deleteWorkProject,
  saveWorkProjectOrder,
  seedDefaultData
} from '../../firebase/firestore';
import { deleteImage } from '../../firebase/storage';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableItem from '../components/SortableItem';
import ProjectModal from '../components/ProjectModal';
import ImageUploader from '../components/ImageUploader';
import {
  LogOut,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Shield,
  Loader2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function Dashboard() {
  const { logout, currentUser } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  // Core Data Fetch States
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states mapping directly to section forms
  const [heroForm, setHeroForm] = useState(null);
  const [aboutForm, setAboutForm] = useState(null);
  const [workForm, setWorkForm] = useState(null); // Local list for currently active work tab
  const [expForm, setExpForm] = useState(null);   // Array of experience objects (with temp ids)
  const [skillsForm, setSkillsForm] = useState(null);
  const [bgForm, setBgForm] = useState(null);
  const [footerForm, setFooterForm] = useState(null);

  // 1. Initial Data Load
  const loadData = async () => {
    setLoading(true);
    try {
      const payload = await fetchPortfolioData();
      setData(payload);
      initializeForms(payload);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load portfolio database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Unsaved Changes Warning Logic
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to discard them?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Tab Switch Guard
  const handleTabClick = (tabId) => {
    if (tabId === activeTab) return;
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Switch tabs and discard edits?');
      if (!confirmDiscard) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
    setSaveStatus('');
  };

  // Re-sync form state when activeTab changes
  useEffect(() => {
    if (data) {
      initializeForms(data);
    }
  }, [activeTab, data]);

  // Initialize all input states based on main data payload
  const initializeForms = (payload) => {
    if (!payload) return;

    // Hero tab
    setHeroForm({
      eyebrowText: payload.hero.eyebrowText || '',
      headlineLine1: payload.hero.headlineLine1 || '',
      headlineLine2: payload.hero.headlineLine2 || '',
      bioText: payload.hero.bioText || '',
      resumeLink: payload.hero.resumeLink || '',
      socialLinks: payload.hero.socialLinks || { linkedin: '', instagram: '', behance: '', email: '' },
      portraitImage: payload.hero.portraitImage || '',
      badgeText: payload.hero.badgeText || '',
      stats: (payload.hero.stats || []).map((s, idx) => ({
        id: s.id || `stat-${idx}-${Date.now()}`,
        value: s.value,
        label: s.label
      })),
      disciplineTags: payload.hero.disciplineTags || []
    });

    // About tab
    setAboutForm({
      paragraph: payload.about.paragraph || '',
      profilePhoto: payload.about.profilePhoto || '',
      statsInput: (payload.about.stats || []).join(', ')
    });

    // Skills tab
    setSkillsForm({
      toolsInput: (payload.skills.tools || []).join(', '),
      otherInput: (payload.skills.other || []).join(', ')
    });

    // Background tab
    setBgForm({
      degree: payload.background.degree || '',
      institution: payload.background.institution || '',
      year: payload.background.year || '',
      philosophy: payload.background.philosophy || '',
      achievementsInput: (payload.background.achievements || []).join('\n')
    });

    // Footer tab
    setFooterForm({
      tagline: payload.footer.tagline || '',
      linkedinUrl: payload.footer.linkedinUrl || '',
      instagramUrl: payload.footer.instagramUrl || '',
      behanceUrl: payload.footer.behanceUrl || '',
      email: payload.footer.email || '',
      copyright: payload.footer.copyright || ''
    });

    // Experience: Assign temporary IDs for drag sorting compatibility
    const mappedExp = (payload.experience || []).map((exp, idx) => ({
      id: `exp-${idx}-${Date.now()}`,
      role: exp.role || '',
      company: exp.company || '',
      duration: exp.duration || '',
      pointsInput: (exp.points || []).join('\n')
    }));
    setExpForm(mappedExp);

    // Work tab: Map list based on active sub-category
    if (activeTab.startsWith('work-')) {
      const cat = activeTab.replace('work-', '');
      setWorkForm(payload.work[cat] || []);
    }
  };

  // 3. Sensor setups for DnD-Kit reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const handleDragEndWork = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWorkForm((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      setHasUnsavedChanges(true);
      return reordered;
    });
  };

  const handleDragEndExp = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setExpForm((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      setHasUnsavedChanges(true);
      return reordered;
    });
  };

  const handleDragEndStats = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setHeroForm((prev) => {
      const oldIndex = prev.stats.findIndex((item) => item.id === active.id);
      const newIndex = prev.stats.findIndex((item) => item.id === over.id);
      const reorderedStats = arrayMove(prev.stats, oldIndex, newIndex);
      setHasUnsavedChanges(true);
      return {
        ...prev,
        stats: reorderedStats
      };
    });
  };

  // 4. Section Save Handlers (Mutating Firestore)
  const triggerSave = async (e) => {
    if (e) e.preventDefault();
    setSaveStatus('saving');

    try {
      if (activeTab === 'hero') {
        const payload = {
          eyebrowText: (heroForm.eyebrowText || '').trim(),
          headlineLine1: (heroForm.headlineLine1 || '').trim(),
          headlineLine2: (heroForm.headlineLine2 || '').trim(),
          bioText: (heroForm.bioText || '').trim(),
          resumeLink: (heroForm.resumeLink || '').trim(),
          socialLinks: {
            linkedin: (heroForm.socialLinks?.linkedin || '').trim(),
            instagram: (heroForm.socialLinks?.instagram || '').trim(),
            behance: (heroForm.socialLinks?.behance || '').trim(),
            email: (heroForm.socialLinks?.email || '').trim()
          },
          portraitImage: heroForm.portraitImage || '',
          badgeText: (heroForm.badgeText || '').trim(),
          stats: (heroForm.stats || []).map(s => ({ value: s.value, label: s.label })),
          disciplineTags: heroForm.disciplineTags || []
        };
        await saveHero(payload);
      } 
      
      else if (activeTab === 'about') {
        const payload = {
          paragraph: aboutForm.paragraph.trim(),
          profilePhoto: aboutForm.profilePhoto,
          stats: aboutForm.statsInput.split(',').map((s) => s.trim()).filter(Boolean)
        };
        await saveAbout(payload);
      } 
      
      else if (activeTab === 'skills') {
        const payload = {
          tools: skillsForm.toolsInput.split(',').map((t) => t.trim()).filter(Boolean),
          other: skillsForm.otherInput.split(',').map((o) => o.trim()).filter(Boolean)
        };
        await saveSkills(payload);
      } 
      
      else if (activeTab === 'background') {
        const payload = {
          degree: bgForm.degree.trim(),
          institution: bgForm.institution.trim(),
          year: bgForm.year.trim(),
          philosophy: bgForm.philosophy.trim(),
          achievements: bgForm.achievementsInput.split('\n').map((a) => a.trim()).filter(Boolean)
        };
        await saveBackground(payload);
      } 
      
      else if (activeTab === 'footer') {
        const payload = {
          tagline: footerForm.tagline.trim(),
          linkedinUrl: footerForm.linkedinUrl.trim(),
          instagramUrl: footerForm.instagramUrl.trim(),
          behanceUrl: footerForm.behanceUrl.trim(),
          email: footerForm.email.trim(),
          copyright: footerForm.copyright.trim()
        };
        await saveFooter(payload);
      } 
      
      else if (activeTab === 'experience') {
        // Strip temporary IDs before writing to Firestore
        const payload = expForm.map((exp) => ({
          role: exp.role.trim(),
          company: exp.company.trim(),
          duration: exp.duration.trim(),
          points: exp.pointsInput.split('\n').map((p) => p.trim()).filter(Boolean)
        }));
        await saveExperience(payload);
      } 
      
      else if (activeTab.startsWith('work-')) {
        const cat = activeTab.replace('work-', '');
        // Writes updated ordering indices back to Firestore documents in batch
        await saveWorkProjectOrder(cat, workForm);
      }

      // Sync SWR Cache
      mutate('firestore/portfolio');
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      
      // Reload clean database state to reset timestamps
      const updatedData = await fetchPortfolioData();
      setData(updatedData);

      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('Discard unsaved modifications and log out?');
      if (!confirmLeave) return;
    }
    await logout();
    navigate('/admin/login');
  };

  // Reset database handler
  const handleResetDatabase = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all database collections to default? This will overwrite all your current modifications.'
    );
    if (!confirmReset) return;

    setSaveStatus('saving');
    try {
      await seedDefaultData();
      mutate('firestore/portfolio');
      const freshData = await fetchPortfolioData();
      setData(freshData);
      initializeForms(freshData);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      alert('Portfolio database has been successfully reset to defaults!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      alert('Error resetting database. Check browser console.');
    }
  };

  // Modal save handler for individual work items
  const handleSaveProjectModal = async (projectPayload) => {
    const cat = activeTab.replace('work-', '');
    try {
      // Save directly to Firestore subcollection document
      await saveWorkProject(cat, projectPayload.id, projectPayload);
      
      // Update local state list to display instantly
      setWorkForm((prev) => {
        const idx = prev.findIndex((p) => p.id === projectPayload.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = projectPayload;
          return updated;
        } else {
          return [...prev, projectPayload];
        }
      });
      
      // Mark unsaved changes to trigger main reorder save
      setHasUnsavedChanges(true);
      
      // Refresh database
      const updatedData = await fetchPortfolioData();
      setData(updatedData);
    } catch (err) {
      console.error(err);
      alert('Failed to save project card.');
    }
  };

  // Delete project handler (cleans up Firestore & Firebase Storage files)
  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}" from the website? This will also purge its storage images.`)) return;

    const cat = activeTab.replace('work-', '');
    try {
      // 1. Delete Firestore document record
      await deleteWorkProject(cat, project.id);
      
      // 2. Delete linked Firebase Storage image file
      await deleteImage(project.image);

      // Update local visual states
      setWorkForm(workForm.filter((p) => p.id !== project.id));
      setHasUnsavedChanges(true);

      const updated = await fetchPortfolioData();
      setData(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to delete project card.');
    }
  };

  // Helper formatting for firestore timestamp metadata
  const renderLastEdited = (sectionKey) => {
    if (!data) return null;
    const docMeta = data[sectionKey];
    if (docMeta && docMeta.lastEdited) {
      const date = docMeta.lastEdited.toDate ? docMeta.lastEdited.toDate() : new Date(docMeta.lastEdited);
      return (
        <span className="text-[10px] text-[#71717a] flex items-center gap-1 font-mono uppercase tracking-wider">
          <Clock size={12} /> Last Saved: {date.toLocaleTimeString()} ({date.toLocaleDateString()})
        </span>
      );
    }
    return null;
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#6366f1]" size={36} />
        <span className="text-xs uppercase tracking-widest font-mono text-[#a1a1aa] animate-pulse">Syncing Cloud Database...</span>
      </div>
    );
  }

  // Sidebar link details
  const sidebarLinks = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Details' },
    { id: 'work-social', label: 'Work: Campaigns' },
    { id: 'work-print', label: 'Work: Print Editorial' },
    { id: 'work-ui', label: 'Work: UI/UX Platform' },
    { id: 'work-reels', label: 'Work: Motion Reels' },
    { id: 'work-video', label: 'Work: Cinematic Vlog' },
    { id: 'work-branding', label: 'Work: Branding Identity' },
    { id: 'experience', label: 'Experience Timeline' },
    { id: 'skills', label: 'Skills & Tools' },
    { id: 'background', label: 'Background / Creed' },
    { id: 'footer', label: 'Footer / Contact' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col h-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Shield className="text-[#6366f1]" size={20} />
          <h1 className="text-sm font-bold font-display tracking-wider uppercase text-white">
            Portfolio Admin Console
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#a1a1aa] font-medium hidden sm:inline">{currentUser?.email}</span>
          
          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-white border border-amber-500/30 hover:border-amber-500 px-3 py-1.5 rounded bg-amber-500/5 transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#6366f1] hover:text-white border border-[#4f46e5]/30 hover:border-[#6366f1] px-3 py-1.5 rounded bg-[#4f46e5]/5 transition-all"
          >
            <ExternalLink size={12} />
            <span>Preview Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#f4f4f5] hover:text-red-400 hover:bg-red-950/10 border border-[#27272a] hover:border-red-900/30 px-3 py-1.5 rounded transition-all"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Panel Frame */}
      <div className="flex grow overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 border-r border-[#27272a] bg-[#121214] flex flex-col overflow-y-auto shrink-0 py-4 px-3">
          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-3 mb-3 block">
            CMS Editable Sections
          </span>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors duration-150 flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-[#4f46e5]/10 text-[#6366f1] border border-[#4f46e5]/30'
                    : 'text-[#a1a1aa] hover:text-white border border-transparent hover:bg-[#18181b]'
                }`}
              >
                <span>{link.label}</span>
                {link.id.startsWith('work-') && (
                  <span className="text-[9px] bg-[#27272a] text-[#71717a] px-1.5 py-0.5 rounded font-mono">
                    {data.work[link.id.replace('work-', '')]?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Editor Area */}
        <main className="grow flex flex-col bg-[#09090b] overflow-hidden relative">
          
          {/* Unsaved Changes Banner */}
          {hasUnsavedChanges && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#6366f1] animate-pulse z-40" />
          )}

          {/* Section Header */}
          <div className="px-8 py-5 border-b border-[#27272a] bg-[#121214]/40 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-display text-white capitalize">
                {activeTab.replace('work-', 'Work: ').replace('-', ' ')}
              </h2>
              {renderLastEdited(activeTab.startsWith('work-') ? 'work' : activeTab)}
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-xs text-[#6366f1] font-medium animate-pulse">
                  Unsaved modifications
                </span>
              )}

              <button
                onClick={triggerSave}
                disabled={saveStatus === 'saving' || (!hasUnsavedChanges && !activeTab.startsWith('work-'))}
                className="flex items-center gap-1.5 text-xs bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold px-4.5 py-2.5 rounded transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor Contents */}
          <div className="grow overflow-y-auto px-8 py-6 max-w-3xl">
            {/* HERO EDITOR */}
            {activeTab === 'hero' && heroForm && (
              <form onSubmit={triggerSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Hero Eyebrow Text</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={heroForm.eyebrowText}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, eyebrowText: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Headline Line 1</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={heroForm.headlineLine1}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, headlineLine1: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Headline Line 2 (Gradient text line)</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={heroForm.headlineLine2}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, headlineLine2: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Bio Description (2-3 lines)</label>
                  <textarea
                    required
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[90px]"
                    value={heroForm.bioText}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, bioText: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Resume Link (URL)</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={heroForm.resumeLink}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, resumeLink: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Floating Badge Text (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={heroForm.badgeText}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, badgeText: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#27272a]">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Discipline Tags (Max 8)</label>
                    <span className="text-xs text-[#a1a1aa]">({(heroForm.disciplineTags || []).length} of 8)</span>
                  </div>
                  
                  <div className="space-y-3">
                    {(heroForm.disciplineTags || []).map((tag, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-[#18181b]/20 p-3 rounded border border-[#27272a]/60">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-[#71717a] uppercase font-bold">Tag Label</label>
                          <input
                            type="text"
                            className="w-full bg-[#18181b]/60 border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                            placeholder="e.g. Creative Direction"
                            value={tag.label}
                            onChange={(e) => {
                              const newTags = [...heroForm.disciplineTags];
                              newTags[idx] = { ...newTags[idx], label: e.target.value };
                              setHeroForm({ ...heroForm, disciplineTags: newTags });
                              setHasUnsavedChanges(true);
                            }}
                          />
                        </div>
                        
                        <div className="w-32 space-y-1">
                          <label className="text-[10px] text-[#71717a] uppercase font-bold">Accent Color</label>
                          <select
                            className="w-full bg-[#18181b]/60 border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                            value={tag.color || 'neutral'}
                            onChange={(e) => {
                              const newTags = [...heroForm.disciplineTags];
                              newTags[idx] = { ...newTags[idx], color: e.target.value };
                              setHeroForm({ ...heroForm, disciplineTags: newTags });
                              setHasUnsavedChanges(true);
                            }}
                          >
                            <option value="violet">Violet</option>
                            <option value="amber">Amber</option>
                            <option value="neutral">Neutral</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          className="text-red-500 hover:text-red-400 p-2 mt-4 self-center transition-colors"
                          onClick={() => {
                            const newTags = heroForm.disciplineTags.filter((_, i) => i !== idx);
                            setHeroForm({ ...heroForm, disciplineTags: newTags });
                            setHasUnsavedChanges(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`admin-btn-add flex items-center gap-2 mt-2 ${(heroForm.disciplineTags || []).length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={(heroForm.disciplineTags || []).length >= 8}
                    onClick={() => {
                      const newTags = [...(heroForm.disciplineTags || []), { label: '', color: 'neutral' }];
                      setHeroForm({ ...heroForm, disciplineTags: newTags });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Tag
                  </button>
                </div>

                {/* Social Links Sub-Form */}
                <div className="space-y-4 pt-4 border-t border-[#27272a]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-[#a1a1aa] font-medium">LinkedIn URL</label>
                      <input
                        type="text"
                        className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                        value={heroForm.socialLinks?.linkedin || ''}
                        onChange={(e) => {
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, linkedin: e.target.value }
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#a1a1aa] font-medium">Instagram URL</label>
                      <input
                        type="text"
                        className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                        value={heroForm.socialLinks?.instagram || ''}
                        onChange={(e) => {
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, instagram: e.target.value }
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#a1a1aa] font-medium">Behance URL</label>
                      <input
                        type="text"
                        className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                        value={heroForm.socialLinks?.behance || ''}
                        onChange={(e) => {
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, behance: e.target.value }
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#a1a1aa] font-medium">Email Address</label>
                      <input
                        type="email"
                        className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                        value={heroForm.socialLinks?.email || ''}
                        onChange={(e) => {
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, email: e.target.value }
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile photo manager */}
                <div className="space-y-2 pt-4 border-t border-[#27272a]">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Hero Portrait Image</label>
                  <ImageUploader
                    section="hero"
                    value={heroForm.portraitImage}
                    onChange={(url) => {
                      setHeroForm({ ...heroForm, portraitImage: url });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="svg:profile-placeholder"
                  />
                </div>

                {/* Dynamic Stats List Editor */}
                <div className="space-y-4 pt-4 border-t border-[#27272a]">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Hero Stats (Bottom Row, Max 4)</h4>
                    <span className="text-xs text-[#a1a1aa]">({(heroForm.stats || []).length} of 4)</span>
                  </div>
                  <div className="space-y-3">
                    {heroForm.stats && heroForm.stats.length > 0 ? (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndStats}>
                        <SortableContext items={heroForm.stats.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                          {heroForm.stats.map((stat, index) => (
                            <SortableItem key={stat.id} id={stat.id}>
                              <div className="flex items-end gap-3 grow">
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">Stat Value (e.g. 10+)</label>
                                    <input
                                      type="text"
                                      required
                                      className="w-full bg-[#18181b]/60 border border-[#27272a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                                      value={stat.value}
                                      onChange={(e) => {
                                        const newStats = [...heroForm.stats];
                                        newStats[index] = { ...newStats[index], value: e.target.value };
                                        setHeroForm({ ...heroForm, stats: newStats });
                                        setHasUnsavedChanges(true);
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">Stat Label (e.g. Projects Shipped)</label>
                                    <input
                                      type="text"
                                      required
                                      className="w-full bg-[#18181b]/60 border border-[#27272a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                                      value={stat.label}
                                      onChange={(e) => {
                                        const newStats = [...heroForm.stats];
                                        newStats[index] = { ...newStats[index], label: e.target.value };
                                        setHeroForm({ ...heroForm, stats: newStats });
                                        setHasUnsavedChanges(true);
                                      }}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="text-[#FF5F56] hover:text-[#ff4b40] p-2 transition-colors mb-0.5 shrink-0"
                                  onClick={() => {
                                    const newStats = heroForm.stats.filter((_, i) => i !== index);
                                    setHeroForm({ ...heroForm, stats: newStats });
                                    setHasUnsavedChanges(true);
                                  }}
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </SortableItem>
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">No stats defined yet. Click "Add Stat Card" below.</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`admin-btn-add flex items-center gap-2 mt-2 ${heroForm.stats && heroForm.stats.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={heroForm.stats && heroForm.stats.length >= 4}
                    onClick={() => {
                      const newStats = [...(heroForm.stats || []), { id: `stat-${Date.now()}`, value: '', label: '' }];
                      setHeroForm({ ...heroForm, stats: newStats });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Stat Card
                  </button>
                </div>
              </form>
            )}

            {/* ABOUT EDITOR */}
            {activeTab === 'about' && aboutForm && (
              <form onSubmit={triggerSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Bio Description (HTML allowed)</label>
                  <textarea
                    required
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[140px]"
                    value={aboutForm.paragraph}
                    onChange={(e) => {
                      setAboutForm({ ...aboutForm, paragraph: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                {/* Profile photo manager */}
                <ImageUploader
                  section="about"
                  value={aboutForm.profilePhoto}
                  onChange={(url) => {
                    setAboutForm({ ...aboutForm, profilePhoto: url });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="svg:profile-placeholder"
                />

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Stat Pills (Comma separated)</label>
                  <input
                    type="text"
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={aboutForm.statsInput}
                    onChange={(e) => {
                      setAboutForm({ ...aboutForm, statsInput: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </form>
            )}

            {/* WORK GRID SORTABLE EDITORS */}
            {activeTab.startsWith('work-') && workForm && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-[#a1a1aa]">
                    Drag items by their handle to reorder the layout. Set status drafts to hide cards.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs bg-[#4f46e5]/10 border border-[#4f46e5]/30 hover:border-[#6366f1] text-[#6366f1] px-3.5 py-2 rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                {workForm.length === 0 ? (
                  <div className="border border-[#27272a] bg-[#18181b]/10 rounded-lg p-10 flex flex-col items-center justify-center text-center">
                    <FolderOpen className="text-[#52525b] mb-2" size={36} />
                    <h5 className="font-semibold text-white">No projects found</h5>
                    <p className="text-xs text-[#71717a] mt-1">Add a project card to get started.</p>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndWork}>
                    <SortableContext items={workForm.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      {workForm.map((proj) => (
                        <SortableItem key={proj.id} id={proj.id}>
                          <div className="flex justify-between items-center grow">
                            <div className="text-xs space-y-1">
                              <h5 className="font-semibold text-white flex items-center gap-2">
                                {proj.title}
                                {proj.status === 'draft' && (
                                  <span className="bg-amber-950/40 text-amber-500 border border-amber-900/30 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">
                                    Draft
                                  </span>
                                )}
                              </h5>
                              <p className="text-[#71717a]">{proj.tag}</p>
                            </div>
                            
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject(proj);
                                  setIsModalOpen(true);
                                }}
                                className="w-8 h-8 rounded border border-[#27272a] hover:bg-[#27272a] text-white flex items-center justify-center transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj)}
                                className="w-8 h-8 rounded border border-red-900/20 text-red-400 hover:bg-red-950/20 flex items-center justify-center transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}

            {/* EXPERIENCE EDITOR */}
            {activeTab === 'experience' && expForm && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-[#a1a1aa]">
                    Drag elements to reorder experience sequence cards.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setExpForm((prev) => [
                        ...prev,
                        {
                          id: `exp-${Date.now()}`,
                          role: 'New Role',
                          company: 'New Company',
                          duration: 'Date Duration',
                          pointsInput: ''
                        }
                      ]);
                      setHasUnsavedChanges(true);
                    }}
                    className="flex items-center gap-1 text-xs bg-[#4f46e5]/10 border border-[#4f46e5]/30 hover:border-[#6366f1] text-[#6366f1] px-3.5 py-2 rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Entry</span>
                  </button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndExp}>
                  <SortableContext items={expForm.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                    {expForm.map((exp, index) => (
                      <SortableItem key={exp.id} id={exp.id}>
                        <div className="space-y-4 grow">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wide">Role</label>
                              <input
                                type="text"
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                                value={exp.role}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExpForm(expForm.map((item) => item.id === exp.id ? { ...item, role: val } : item));
                                  setHasUnsavedChanges(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wide">Company</label>
                              <input
                                type="text"
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                                value={exp.company}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExpForm(expForm.map((item) => item.id === exp.id ? { ...item, company: val } : item));
                                  setHasUnsavedChanges(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wide">Duration</label>
                              <input
                                type="text"
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                                value={exp.duration}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExpForm(expForm.map((item) => item.id === exp.id ? { ...item, duration: val } : item));
                                  setHasUnsavedChanges(true);
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wide">Bullet points (One per line)</label>
                            <textarea
                              className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1] min-h-[60px]"
                              value={exp.pointsInput}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  setExpForm(expForm.map((item) => item.id === exp.id ? { ...item, pointsInput: val } : item));
                                  setHasUnsavedChanges(true);
                              }}
                            />
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this experience entry?')) {
                                setExpForm(expForm.filter((item) => item.id !== exp.id));
                                setHasUnsavedChanges(true);
                              }
                            }}
                            className="w-8 h-8 rounded border border-red-900/20 text-red-400 hover:bg-red-950/20 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* SKILLS EDITOR */}
            {activeTab === 'skills' && skillsForm && (
              <form onSubmit={triggerSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Design Tools (Comma separated)</label>
                  <textarea
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[80px]"
                    value={skillsForm.toolsInput}
                    onChange={(e) => {
                      setSkillsForm({ ...skillsForm, toolsInput: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Disciplines & specialties (Comma separated)</label>
                  <textarea
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[90px]"
                    value={skillsForm.otherInput}
                    onChange={(e) => {
                      setSkillsForm({ ...skillsForm, otherInput: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </form>
            )}

            {/* BACKGROUND EDITOR */}
            {activeTab === 'background' && bgForm && (
              <form onSubmit={triggerSave} className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Education Degree</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={bgForm.degree}
                      onChange={(e) => {
                        setBgForm({ ...bgForm, degree: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Institution</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={bgForm.institution}
                      onChange={(e) => {
                        setBgForm({ ...bgForm, institution: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Year Details</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={bgForm.year}
                      onChange={(e) => {
                        setBgForm({ ...bgForm, year: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Creed / Philosophy Note</label>
                  <textarea
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[90px]"
                    value={bgForm.philosophy}
                    onChange={(e) => {
                      setBgForm({ ...bgForm, philosophy: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Achievements (One per line)</label>
                  <textarea
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors min-h-[80px]"
                    value={bgForm.achievementsInput}
                    onChange={(e) => {
                      setBgForm({ ...bgForm, achievementsInput: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </form>
            )}

            {/* FOOTER EDITOR */}
            {activeTab === 'footer' && footerForm && (
              <form onSubmit={triggerSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Footer Tagline</label>
                  <input
                    type="text"
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={footerForm.tagline}
                    onChange={(e) => {
                      setFooterForm({ ...footerForm, tagline: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">LinkedIn Link</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={footerForm.linkedinUrl}
                      onChange={(e) => {
                        setFooterForm({ ...footerForm, linkedinUrl: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Instagram Link</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={footerForm.instagramUrl}
                      onChange={(e) => {
                        setFooterForm({ ...footerForm, instagramUrl: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Behance Link</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={footerForm.behanceUrl}
                      onChange={(e) => {
                        setFooterForm({ ...footerForm, behanceUrl: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Contact Email</label>
                    <input
                      type="text"
                      className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                      value={footerForm.email}
                      onChange={(e) => {
                        setFooterForm({ ...footerForm, email: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Copyright Notice</label>
                  <input
                    type="text"
                    className="w-full bg-[#18181b]/40 border border-[#27272a] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={footerForm.copyright}
                    onChange={(e) => {
                      setFooterForm({ ...footerForm, copyright: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </form>
            )}
          </div>

          {/* Save Status Notifications Overlay */}
          {saveStatus === 'saved' && (
            <div className="absolute bottom-6 right-6 bg-[#6366f1] text-white text-xs font-bold px-4 py-2.5 rounded shadow-xl flex items-center gap-1.5 animate-bounce z-40">
              <RefreshCw className="animate-spin" size={14} />
              <span>Section updated successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="absolute bottom-6 right-6 bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded shadow-xl z-40">
              Failed to write updates to Firestore.
            </div>
          )}
        </main>
      </div>

      {/* Modal dialog for adding/editing work cards */}
      {activeTab.startsWith('work-') && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          category={activeTab.replace('work-', '')}
          onSave={handleSaveProjectModal}
        />
      )}
    </div>
  );
}
