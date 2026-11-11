import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { 
  Figma, 
  Video, 
  Layers, 
  Cpu, 
  PenTool, 
  Sparkles, 
  Palette,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const Skills = ({ skillsData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const { tools = [], other = [] } = skillsData || {
    tools: ["Figma", "Adobe Premiere", "CapCut", "Adobe Illustrator", "Canva", "DaVinci Resolve", "After Effects"],
    other: ["Brand Identity", "Social Media Strategy", "Motion Design", "Print Layout", "UI/UX Design", "Content Direction", "Editorial Systems", "Chemical Engineering"]
  };

  // Group tools into categories
  const softwareTools = tools;
  const designSpecialties = other;

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
            <span className="section-eyebrow">Capabilities</span>
            <h2 className="section-title">Skills & Creative Stack</h2>
            <p className="section-desc">
              The software, production suites, and systematic disciplines I leverage daily.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Full Stack Production
            </span>
          </div>
        </div>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Software & Production Tools */}
          <div className="glass-card p-6 sm:p-8 bg-white">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="display-font text-lg font-bold text-slate-900">
                  Software & Production Tools
                </h3>
                <span className="text-xs text-slate-500">Design, Vector, Motion & Video Suites</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {softwareTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 hover:border-indigo-500 hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all cursor-default"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Tool');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Creative Disciplines & Systems */}
          <div className="glass-card p-6 sm:p-8 bg-white">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Palette size={20} />
              </div>
              <div>
                <h3 className="display-font text-lg font-bold text-slate-900">
                  Disciplines & Domain Focus
                </h3>
                <span className="text-xs text-slate-500">Architectural Systems, Brand & Strategy</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {designSpecialties.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 hover:border-amber-500 hover:bg-white hover:text-amber-600 hover:shadow-md transition-all cursor-default"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Focus');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
