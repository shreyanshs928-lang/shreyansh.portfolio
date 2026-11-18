import React, { useRef, useContext, useState } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Rocket, 
  Award, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Layers,
  Activity
} from 'lucide-react';

// Helper to deduce category and icon if not explicitly set in CMS
function getRoleMeta(exp) {
  const text = `${exp.role} ${exp.company} ${(exp.points || []).join(' ')}`.toLowerCase();

  if (text.includes('rocket') || text.includes('telemetry')) {
    return {
      category: 'rocketry',
      categoryLabel: 'FLIGHT SYSTEMS & TELEMETRY',
      icon: <Rocket size={16} className="text-cyan-500" />,
      accentColor: '#06B6D4',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
      tools: ['Telemetry UI', 'Vector Schemas', 'Merchandise', 'Figma']
    };
  }
  if (text.includes('alumination') || text.includes('lead') || text.includes('e-cell')) {
    return {
      category: 'leadership',
      categoryLabel: 'LEADERSHIP & BRAND SYSTEMS',
      icon: <Award size={16} className="text-indigo-500" />,
      accentColor: '#4F46E5',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      tools: ['Brand Architecture', 'Team of 8', 'Editorial Print', 'Figma']
    };
  }
  if (text.includes('mood indigo') || text.includes('video') || text.includes('reels')) {
    return {
      category: 'festivals',
      categoryLabel: 'FESTIVAL MEDIA & CINEMATIC MOTION',
      icon: <Sparkles size={16} className="text-rose-500" />,
      accentColor: '#F43F5E',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      tools: ['Aftermovies', 'DaVinci Resolve', 'Kinetic Typography', '150k+ Views']
    };
  }
  return {
    category: 'independent',
    categoryLabel: 'INDEPENDENT CLIENTS & STARTUPS',
    icon: <Briefcase size={16} className="text-amber-500" />,
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    tools: ['UI/UX Design', 'Design Systems', 'Client Brandbooks']
  };
}

export const Experience = ({ experienceData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [filterCategory, setFilterCategory] = useState('all');

  const rawExperiences = Array.isArray(experienceData) ? experienceData : [];

  // Filter experiences by category
  const filteredExperiences = rawExperiences.filter(exp => {
    if (filterCategory === 'all') return true;
    const meta = getRoleMeta(exp);
    return meta.category === filterCategory;
  });

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-white py-20 md:py-28 border-b border-slate-200/80 relative overflow-hidden`}
    >
      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="section-eyebrow">CHRONOLOGICAL RECORD</span>
            <h2 className="section-title">Experience & Journey</h2>
            <p className="section-desc">
              Directing creative systems, rocket telemetry interfaces, and brand campaigns across IIT Bombay.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
              <Clock size={13} className="text-indigo-600" />
              <span>2024 — PRESENT</span>
            </span>
          </div>
        </div>

        {/* Timeline Metrics Bento Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              TOTAL TIMELINE
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="display-font text-2xl sm:text-3xl font-extrabold text-slate-900">2+</span>
              <span className="text-xs font-semibold text-slate-600">Years Active</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">From Jan 2024 to present</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              ALUMNI & CAMPUS REACH
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="display-font text-2xl sm:text-3xl font-extrabold text-indigo-600">40K+</span>
              <span className="text-xs font-semibold text-slate-600">Recipients</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Annual Alumination Booklets</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              ORGANIC MEDIA REACH
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="display-font text-2xl sm:text-3xl font-extrabold text-rose-600">150K+</span>
              <span className="text-xs font-semibold text-slate-600">Views</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Festival Video Releases</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              FLIGHT TELEMETRY
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="display-font text-2xl sm:text-3xl font-extrabold text-cyan-600">IITB</span>
              <span className="text-xs font-semibold text-slate-600">Rocket Team</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Flight HUD & Blueprints</span>
          </div>
        </div>

        {/* Timeline Category Filter Spell */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-100">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">
            FILTER TRACK:
          </span>
          {[
            { id: 'all', label: `ALL MILESTONES (${rawExperiences.length})` },
            { id: 'leadership', label: 'LEADERSHIP & BRAND' },
            { id: 'rocketry', label: 'ROCKETRY & TELEMETRY' },
            { id: 'festivals', label: 'FESTIVAL MEDIA' },
            { id: 'independent', label: 'INDEPENDENT' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`text-xs font-mono px-3.5 py-1.5 rounded-full transition-all border ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
              }`}
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover(tab.id);
              }}
              onMouseLeave={triggerDefault}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Vertical Timeline Architecture */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-indigo-100 space-y-10 max-w-4xl mx-auto">
          {/* Animated Timeline Spine Gradient Highlight */}
          <div className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 via-violet-500 to-amber-500 opacity-80 pointer-events-none" />

          {filteredExperiences.map((exp, idx) => {
            const meta = getRoleMeta(exp);
            const isPresent = exp.duration?.toLowerCase().includes('present');

            return (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => triggerHover('Timeline')}
                onMouseLeave={triggerDefault}
              >
                {/* Timeline Milestone Node */}
                <div 
                  className={`absolute -left-[31px] sm:-left-[47px] top-4 w-5 h-5 rounded-full bg-white border-4 transition-transform duration-300 group-hover:scale-125 shadow-sm flex items-center justify-center ${
                    isPresent ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-indigo-600'
                  }`}
                >
                  {isPresent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>

                {/* Timeline Card */}
                <div className="bento-card p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-slate-300">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                    <div>
                      {/* Meta badge */}
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border mb-2.5"
                        style={{ backgroundColor: `${meta.accentColor}12`, borderColor: `${meta.accentColor}30`, color: meta.accentColor }}
                      >
                        {meta.icon}
                        <span>{meta.categoryLabel}</span>
                      </div>

                      <h3 className="display-font text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {exp.role}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm font-semibold text-slate-600">
                        <span>{exp.company}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400 font-normal">IIT Bombay Core</span>
                      </div>
                    </div>

                    {/* Timeline Tag & Status */}
                    <div className="flex flex-wrap sm:flex-col sm:items-end gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <Calendar size={12} className="text-indigo-600" />
                        {exp.duration}
                      </span>
                      {isPresent && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          CURRENT ROLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-3 mb-6">
                    {(exp.points || []).map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tools & Artifact Deliverable Tags */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">
                        DELIVERABLES:
                      </span>
                      {meta.tools.map((tool, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-700 hover:border-indigo-400 hover:bg-white transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      PHASE #{rawExperiences.length - idx}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Experience;