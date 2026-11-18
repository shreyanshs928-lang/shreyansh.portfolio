import React, { useRef, useContext, useState } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { 
  Wrench, 
  Palette, 
  Sparkles, 
  Cpu, 
  Box, 
  Layers, 
  Video, 
  CheckCircle2, 
  Terminal,
  Activity
} from 'lucide-react';

export const Skills = ({ skillsData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [activeTab, setActiveTab] = useState('all');

  const { tools = [], other = [] } = skillsData || {
    tools: ["Figma", "Adobe Premiere", "CapCut", "Adobe Illustrator", "Canva", "DaVinci Resolve", "After Effects", "Adobe Photoshop"],
    other: ["Brand Identity", "Social Media Strategy", "Motion Design", "Print Layout", "UI/UX Design", "Content Direction", "Editorial Systems", "Chemical Engineering"]
  };

  const softwareTools = [
    { name: "Adobe Photoshop", category: "Raster", proficiency: "Expert", level: 95, color: "#31A8FF" },
    { name: "Adobe Illustrator", category: "Vector", proficiency: "Expert", level: 92, color: "#FF9A00" },
    { name: "DaVinci Resolve", category: "Color & Video", proficiency: "Advanced", level: 88, color: "#FF5722" },
    { name: "Figma", category: "UI/UX & Systems", proficiency: "Mastery", level: 96, color: "#A259FF" },
    { name: "Adobe Premiere", category: "Video Edit", proficiency: "Advanced", level: 90, color: "#9999FF" },
    { name: "After Effects", category: "Motion Graphics", proficiency: "Proficient", level: 82, color: "#CF96FD" },
    { name: "Canva", category: "Rapid Layout", proficiency: "Advanced", level: 90, color: "#00C4CC" },
    { name: "CapCut", category: "Social Shortform", proficiency: "Expert", level: 94, color: "#22C55E" }
  ];

  const disciplines = [
    { name: "UI/UX Design Systems", desc: "Atomic design tokens, high data density, component libraries", icon: <Layers size={18} className="text-indigo-600" /> },
    { name: "Flight Telemetry Interfaces", desc: "Telemetry monitors, real-time gauges, and mission control UX", icon: <Activity size={18} className="text-emerald-600" /> },
    { name: "Brand & Visual Identity", desc: "Grid construction, geometric vector systems, brand guidelines", icon: <Palette size={18} className="text-amber-600" /> },
    { name: "Kinetic Motion & Trailers", desc: "Frame-by-frame pacing, kinetic typography, teaser hook pacing", icon: <Video size={18} className="text-rose-600" /> },
    { name: "Editorial Print & Zines", desc: "Swiss typographic grids, multi-page booklet layout, ink specs", icon: <Box size={18} className="text-cyan-600" /> },
    { name: "Engineering Logic & Systems", desc: "Thermodynamics, feedback control loops, mathematical symmetry", icon: <Cpu size={18} className="text-violet-600" /> }
  ];

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-slate-50/50 py-20 border-b border-slate-200/80`}
    >
      <div className="container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="section-eyebrow">CAPABILITIES MATRIX</span>
            <h2 className="section-title">Skills & Production Stack</h2>
            <p className="section-desc">
              The professional tools, production suites, and systematic disciplines I leverage daily.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>BENTO STACK VIEW</span>
            </span>
          </div>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Card 1: Primary Software Deck (Span 7) */}
          <div className="md:col-span-7 bento-card p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h3 className="display-font text-lg font-bold text-slate-900">
                      Software & Production Suites
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      DESIGN, VECTOR, MOTION & VIDEO
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-semibold">
                  8 SUITES
                </span>
              </div>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {softwareTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all group"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover(tool.name);
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: tool.color }}
                        />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {tool.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {tool.proficiency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{tool.category}</span>
                      <span className="font-semibold text-slate-700">{tool.level}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${tool.level}%`, backgroundColor: tool.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>SPECIALTY: 3D, MOTION & DESIGN SYSTEMS</span>
              <span className="text-emerald-600 font-bold">100% PRODUCTION READY</span>
            </div>
          </div>

          {/* Bento Card 2: Disciplines & Systematic Approaches (Span 5) */}
          <div className="md:col-span-5 bento-card p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h3 className="display-font text-lg font-bold text-slate-900">
                      Disciplines & Domain Focus
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      SYSTEMS, IDENTITY & ARCHITECTURE
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                  SYSTEMS
                </span>
              </div>

              {/* Disciplines List */}
              <div className="space-y-3">
                {disciplines.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all flex items-start gap-3 group"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('Focus');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>METHODOLOGY</span>
              <span className="text-slate-800 font-bold">ENGINEERING RIGOR</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Skills;