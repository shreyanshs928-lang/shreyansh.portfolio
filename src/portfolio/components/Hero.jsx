import React, { useEffect, useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { CursorContext } from '../../context/CursorContext';
import { 
  ArrowDown, 
  ArrowUpRight, 
  Download, 
  Linkedin, 
  Instagram, 
  Mail, 
  Sparkles,
  Layers,
  Compass,
  Cpu,
  Palette
} from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';

// Behance custom SVG icon
const BehanceIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
    <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
    <line x1="14" y1="7" x2="19" y2="7"/>
  </svg>
);

// Rolling Count-up Metric Card
const MetricStatCard = ({ value, label, delay = 0 }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (!value || typeof value !== 'string') {
      setDisplayValue(value || '');
      return;
    }
    const matches = value.match(/^\d+/);
    if (!matches) {
      setDisplayValue(value);
      return;
    }
    const endVal = parseInt(matches[0], 10);
    const prefix = value.substring(0, value.indexOf(matches[0]));
    const suffix = value.substring(value.indexOf(matches[0]) + matches[0].length);

    let start = null;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const cur = Math.floor(progress * endVal);
      setDisplayValue(`${prefix}${cur}${suffix}`);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      ref={cardRef}
      className="glass-card p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all"
    >
      <span className="display-font text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
        {displayValue}
      </span>
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
        {label}
      </span>
    </div>
  );
};

export const Hero = ({ heroData, isLoading }) => {
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const eyebrow = heroData?.eyebrowText || "Hey, I'm Shreyansh";
  const headline1 = heroData?.headlineLine1 || "Multidisciplinary Designer +";
  const headline2 = heroData?.headlineLine2 || "Chemical Engineer";
  const bio = heroData?.bioText || "I design across UI/UX, motion, print and social — blending an engineer's precision with a designer's instinct. Currently building creative systems at IIT Bombay.";
  const resumeLink = heroData?.resumeLink || "https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing";
  const social = heroData?.socialLinks || {};
  const stats = heroData?.stats || [
    { value: '2+', label: 'Years Designing' },
    { value: '10+', label: 'Projects Shipped' },
    { value: '6', label: 'Creative Disciplines' },
    { value: "IIT Bombay '27", label: 'Student Core' }
  ];

  // Creative disciplines rotating list
  const rotatingWords = [
    "Mission Control UI",
    "Brand Systems",
    "Motion & 3D",
    "Editorial Layouts",
    "Digital Campaigns"
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  // Featured Hero Interactive Showcase Cards
  const showcaseProjects = [
    {
      id: 'showcase-1',
      title: 'Aether Flight Telemetry',
      category: 'UI/UX & Systems',
      subtitle: 'Real-time rocket mission control OS for IIT Bombay Rocket Team',
      image: 'svg:ui-2',
      badge: 'Flight Hardware'
    },
    {
      id: 'showcase-2',
      title: 'Alumination Identity',
      category: 'Brand Architecture',
      subtitle: 'Geometric grid guidelines & typography specs for 40,000+ alumni',
      image: 'svg:branding-1',
      badge: 'Identity System'
    },
    {
      id: 'showcase-3',
      title: 'Aether Propulsion Journal',
      category: 'Editorial Print',
      subtitle: 'Typesetting & technical layout design for annual rocketry zine',
      image: 'svg:print-1',
      badge: 'Print Publication'
    }
  ];

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Ambient background soft light orbs */}
      <div 
        className="ambient-orb"
        style={{
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(167, 139, 250, 0.05) 70%, transparent 100%)'
        }}
      />
      <div 
        className="ambient-orb"
        style={{
          bottom: '5%',
          left: '-5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(251, 113, 133, 0.04) 70%, transparent 100%)',
          animationDelay: '-6s'
        }}
      />

      <div className="container relative z-10">
        {/* Top Status & Intro Pill */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for Q3/Q4 Creative Roles</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600">
            <Sparkles size={13} />
            <span>IIT Bombay Chemical Engineering</span>
          </div>
        </div>

        {/* Hero Grid: Left Content, Right Interactive Creative Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          {/* Left Column: Typography & Story */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="display-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Designing systems for{' '}
              <span className="gradient-text transition-all duration-300">
                {rotatingWords[currentWordIdx]}
              </span>
              <br />
              <span className="text-slate-800 font-bold">with chemical engineering precision.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              {bio}
            </p>

            {/* CTAs and Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#work"
                className="btn btn-primary px-6 py-3.5 text-sm rounded-full shadow-lg"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Explore');
                }}
                onMouseLeave={triggerDefault}
              >
                <span>Explore Selected Works</span>
                <ArrowDown size={16} />
              </a>

              {resumeLink && (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary px-5 py-3.5 text-sm rounded-full"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Resume');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  <Download size={15} />
                  <span>Resume</span>
                </a>
              )}

              {/* Social Icon Pills */}
              <div className="flex items-center gap-2 pl-2">
                {social.behance && (
                  <a
                    href={social.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label="Behance"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('Behance');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <BehanceIcon size={18} />
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label="LinkedIn"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('LinkedIn');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label="Instagram"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('Instagram');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {social.email && (
                  <a
                    href={`mailto:${social.email}`}
                    className="social-icon-btn"
                    aria-label="Email"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('Email');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Creative Interactive 3D Showcase Deck */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Glow Frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 rounded-3xl filter blur-xl opacity-75" />

              {/* Main Active Project Card */}
              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300">
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-slate-500 ml-2 font-mono">
                      {showcaseProjects[activePreviewIndex].badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {showcaseProjects[activePreviewIndex].category}
                  </span>
                </div>

                {/* Media Image */}
                <div className="aspect-[16/10] w-full bg-slate-50 overflow-hidden relative">
                  <ProjectImage
                    src={showcaseProjects[activePreviewIndex].image}
                    alt={showcaseProjects[activePreviewIndex].title}
                    category={showcaseProjects[activePreviewIndex].category}
                    aspectClass="w-full h-full"
                  />
                </div>

                {/* Card Footer Info */}
                <div className="p-5">
                  <h3 className="display-font text-lg font-bold text-slate-900 mb-1">
                    {showcaseProjects[activePreviewIndex].title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {showcaseProjects[activePreviewIndex].subtitle}
                  </p>

                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Deck:
                    </span>
                    {showcaseProjects.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePreviewIndex(idx)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                          activePreviewIndex === idx
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                    <a
                      href="#work"
                      className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      View All <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {stats.map((s, idx) => (
            <MetricStatCard
              key={idx}
              value={s.value}
              label={s.label}
              delay={idx * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
