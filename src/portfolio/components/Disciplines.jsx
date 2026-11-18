import React, { useRef, useContext } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { 
  Compass, 
  Layers, 
  Video, 
  BookOpen, 
  Sparkles, 
  Cpu, 
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const Disciplines = ({ onSelectCategory }) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const disciplineCards = [
    {
      id: 'ui-ux',
      categoryTarget: 'ui',
      icon: <Activity className="text-indigo-600" size={26} />,
      title: 'UI/UX & Flight Telemetry',
      badge: 'Systems UI',
      desc: 'Building mission control telemetry screens, rocket telemetry dashboards, and SaaS portals with high data-density and low cognitive load.',
      highlight: 'IIT Bombay Rocket Team & E-Cell',
      color: 'indigo'
    },
    {
      id: 'brand',
      categoryTarget: 'brand',
      icon: <Compass className="text-amber-500" size={26} />,
      title: 'Brand Systems & Visual Guides',
      badge: 'Identity',
      desc: 'Standardizing identity guidelines, geometric logo construction grids, and cohesive physical merchandise for student bodies and institutions.',
      highlight: 'Alumination IIT Bombay (40,000+ Alumni)',
      color: 'amber'
    },
    {
      id: 'motion',
      categoryTarget: 'video',
      icon: <Video className="text-rose-500" size={26} />,
      title: 'Motion & Cinematic Video',
      badge: 'Direction',
      desc: 'Directing festival teasers, kinetic typography trailers, and launch vlogs that hook viewers in the first 2 seconds.',
      highlight: '150k+ Organic Views for Mood Indigo',
      color: 'rose'
    },
    {
      id: 'print',
      categoryTarget: 'print',
      icon: <BookOpen className="text-emerald-500" size={26} />,
      title: 'Editorial Layouts & Print Media',
      badge: 'Typography',
      desc: 'Precision typesetting, grid mathematics, and multi-page research zines celebrating science, campus culture, and rocketry.',
      highlight: 'Aether Propulsion Journal & Festival Zines',
      color: 'emerald'
    },
    {
      id: 'social',
      categoryTarget: 'social',
      icon: <Sparkles className="text-violet-500" size={26} />,
      title: 'High-Impact Digital Campaigns',
      badge: 'Social Media',
      desc: 'Crafting thumb-stopping carousel decks, speaker release graphics, and teaser drops for Asia’s largest college festivals.',
      highlight: 'E-Summit & Mood Indigo Lineups',
      color: 'violet'
    },
    {
      id: 'engineering',
      categoryTarget: 'about',
      icon: <Cpu className="text-cyan-600" size={26} />,
      title: 'Chemical Engineering × Logic',
      badge: 'Foundations',
      desc: 'Approaching visual design through the lens of thermodynamics, system feedback loops, mathematical grids, and structural symmetry.',
      highlight: 'B.Tech Undergrad · IIT Bombay ’27',
      color: 'cyan'
    }
  ];

  const handleCardClick = (target) => {
    if (target === 'about') {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onSelectCategory) {
        onSelectCategory(target);
      }
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="disciplines" 
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-slate-50/50 border-y border-slate-200/60`}
    >
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="section-eyebrow">Creative Matrix</span>
            <h2 className="section-title">The Six Disciplines</h2>
            <p className="section-desc">
              How systematic engineering principles translate into versatile visual craft. Click any card to filter projects.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Cross-disciplinary Design Architecture
            </span>
          </div>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplineCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.categoryTarget)}
              className="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer"
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover(card.badge);
              }}
              onMouseLeave={triggerDefault}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {card.badge}
                  </span>
                </div>

                <h3 className="display-font text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 font-mono">
                  {card.highlight}
                </span>
                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Disciplines;
