import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { GraduationCap, Trophy, Award, Sparkles, BookOpen } from 'lucide-react';

export const Background = ({ backgroundData }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const { 
    degree = "B.Tech Chemical Engineering", 
    institution = "IIT Bombay", 
    year = "Graduating 2027", 
    philosophy = "All design skills self-taught — built through real projects, not courses. I believe in learning by breaking things, shipping actual work, and designing at the intersection of engineering systems and creative aesthetics.", 
    achievements = [
      "Winner, Mood Indigo Annual Design Hackathon (2025)",
      "Best Branding Runner-up, IITB Tech Fest Design Challenge (2024)"
    ] 
  } = backgroundData || {};

  return (
    <section 
      ref={sectionRef} 
      id="background" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-slate-50/50 py-20 border-b border-slate-200/80`}
    >
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="section-eyebrow">Academic Foundation</span>
            <h2 className="section-title">Education & Creed</h2>
            <p className="section-desc">
              Rooted in engineering principles, applied to digital interfaces and brand identities.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              IIT Bombay Undergraduate
            </span>
          </div>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Academic Card */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                <GraduationCap size={26} />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full inline-block mb-3">
                Degree Program
              </span>

              <h3 className="display-font text-2xl font-bold text-slate-900 mb-1">
                {degree}
              </h3>
              <p className="text-base font-semibold text-slate-600 mb-6">
                {institution}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Studying mass transfer, thermodynamics, process control, and system mechanics — feeding directly into structural interface design.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">
                {year}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Undergraduate Degree
              </span>
            </div>
          </div>

          {/* Right Column: Creed & Honors */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 bg-white space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-amber-500" />
                <h4 className="display-font text-lg font-bold text-slate-900">
                  The Self-Taught Creed
                </h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
                {philosophy}
              </p>
            </div>

            {/* Honors & Hackathon Wins */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-3 flex items-center gap-2">
                <Trophy size={15} className="text-amber-500" />
                Honors & Design Challenges
              </span>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <Award size={18} className="text-indigo-600 shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Background;
