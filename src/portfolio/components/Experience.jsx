import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { Briefcase, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export const Experience = ({ experienceData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const experiences = Array.isArray(experienceData) ? experienceData : [];

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-white py-20 border-b border-slate-200/80`}
    >
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="section-eyebrow">Career & Leadership</span>
            <h2 className="section-title">Experience & Journey</h2>
            <p className="section-desc">
              Leading creative direction and digital assets for college bodies, rocket teams, and festivals.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              2024 – Present
            </span>
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200/90 space-y-12 max-w-4xl mx-auto">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => triggerHover('Role')}
              onMouseLeave={triggerDefault}
            >
              {/* Timeline Dot Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 group-hover:scale-125 group-hover:border-amber-500 transition-all shadow-sm" />

              {/* Experience Card */}
              <div className="glass-card p-6 sm:p-8 bg-slate-50/50 hover:bg-white transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="display-font text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {exp.role}
                    </h3>
                    <span className="text-sm font-semibold text-slate-600">
                      {exp.company}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full bg-white text-slate-600 border border-slate-200 shadow-sm shrink-0">
                    <Calendar size={12} className="text-indigo-500" />
                    {exp.duration}
                  </span>
                </div>

                {/* Achievement points */}
                <ul className="space-y-2.5">
                  {(exp.points || []).map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <ChevronRight size={15} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
