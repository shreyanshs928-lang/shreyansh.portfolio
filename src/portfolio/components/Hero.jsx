import React, { useContext, useState } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { 
  ArrowDown, 
  Download, 
  Linkedin, 
  Instagram, 
  Mail, 
  Camera, 
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Compass,
  Check
} from 'lucide-react';
import Software3DLogos from '../../components/3d/Software3DLogos';

// Behance custom SVG icon
const BehanceIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
    <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
    <line x1="14" y1="7" x2="19" y2="7"/>
  </svg>
);

export const Hero = ({ heroData, aboutData, profileData }) => {
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [imageHover, setImageHover] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Data bindings
  const bio = heroData?.bioText || "I design across UI/UX, motion, print, and social — blending an engineer's precision with a designer's instinct. Currently building creative systems and flight telemetry at IIT Bombay.";
  const resumeLink = heroData?.resumeLink || "https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing";
  const social = heroData?.socialLinks || {};
  const portrait = heroData?.portraitImage;
  const isCustomPhoto = portrait && !portrait.startsWith('svg:');

  // About & Creed data (moved from bottom into Hero Bento)
  const about = aboutData || profileData?.about || {};
  const aboutParagraph = about.paragraph || "I am a self-taught multidisciplinary designer currently studying Chemical Engineering at <strong>IIT Bombay</strong>. My design process is defined by high contrast grids, modern typographic rhythm, and clean execution. From branding campaigns for college festivals to telemetry dashboards for rockets, I design functional art.";
  const stats = about.stats || [
    '2+ Years Designing for Real Products',
    '50+ Shipped Creative Projects & Assets',
    '150k+ Festival Video Views Organically'
  ];

  // Design Spell: Copy email to clipboard with instant micro-interaction
  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (social.email) {
      navigator.clipboard.writeText(social.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  return (
    <section id="hero" className="relative pt-3 pb-16 md:pt-6 md:pb-24 overflow-hidden">
      <div className="container relative z-10">
        
        {/* Availability & Location Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/70 mb-8">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>AVAILABLE FOR SELECT PROJECTS & SUMMER 2026 ROLES</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>IIT BOMBAY</span>
            <span>·</span>
            <span>MUMBAI, INDIA</span>
            <span>·</span>
            <span className="text-slate-800 font-bold">CHEMICAL ENG. '27</span>
          </div>
        </div>

        {/* ========================================================
            BENTO GRID HERO ARCHITECTURE
            Clear hierarchy, modular cards, high-contrast typography
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ------------------------------------------------------
              BENTO CARD 1: BIG NAME & INTRO (Span 7)
             ------------------------------------------------------ */}
          <div className="lg:col-span-7 bento-card p-7 sm:p-9 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Micro badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-mono font-semibold text-slate-600 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>MULTIDISCIPLINARY DESIGNER</span>
              </div>

              {/* Big Name */}
              <h1 className="display-font text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-[-0.035em] text-slate-900 leading-[0.92] uppercase select-none">
                Shreyansh<br />
                <span className="text-slate-800">Singh</span>
              </h1>

              {/* Short Intro placed directly at the bottom of the name */}
              <div className="mt-6 space-y-4 max-w-xl">
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {bio}
                </p>

                {/* Disciplines Chips */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-600 font-medium">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-colors">UI/UX SYSTEMS</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-colors">FLIGHT TELEMETRY</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-colors">BRAND IDENTITY</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-colors">MOTION & VIDEO</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-colors">EDITORIAL PRINT</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Social Links */}
            <div className="pt-8 border-t border-slate-100 mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="btn btn-primary px-6 py-3 text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Explore');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  <span>Explore Selected Works</span>
                  <ArrowDown size={14} />
                </a>

                {resumeLink && (
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary px-5 py-3 text-sm rounded-full flex items-center gap-2"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover('Resume');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    <Download size={14} />
                    <span>Resume</span>
                  </a>
                )}
              </div>

              {/* Social Channels & Copy Email Spell */}
              <div className="flex items-center gap-2">
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
                    <BehanceIcon size={16} />
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
                    <Linkedin size={16} />
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
                    <Instagram size={16} />
                  </a>
                )}
                {social.email && (
                  <button
                    onClick={handleCopyEmail}
                    className="social-icon-btn relative"
                    aria-label="Copy Email"
                    title="Click to copy email"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover(copiedEmail ? 'Copied!' : 'Copy Email');
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    {copiedEmail ? <Check size={16} className="text-emerald-600" /> : <Mail size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------
              BENTO CARD 2: EDITORIAL PORTRAIT (Span 5)
             ------------------------------------------------------ */}
          <div className="lg:col-span-5 bento-card p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div 
              className="relative w-full h-full group"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              {/* Image Frame with 4:5 Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-md transition-all duration-300 group-hover:shadow-xl">
                
                {isCustomPhoto ? (
                  <img
                    src={portrait}
                    alt="Shreyansh Singh"
                    className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  /* Editorial Photo Placeholder Frame */
                  <div className="relative w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200/70 text-slate-700">
                    {/* Top Blueprint Header */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 gap-2 mb-2">
                      <span className="text-[10px] tracking-wider uppercase font-semibold">PORTRAIT</span>
                      <span className="px-2 py-0.5 rounded bg-white/90 border border-slate-200 text-[9px] font-bold tracking-wider shrink-0">
                        4:5
                      </span>
                    </div>

                    {/* Center Avatar / Silhouette Viewport */}
                    <div className="my-auto flex flex-col items-center justify-center text-center p-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:scale-105 transition-transform duration-300">
                        <Camera size={32} strokeWidth={1.5} className="text-slate-500" />
                      </div>
                      <span className="display-font text-base sm:text-lg font-bold text-slate-900 mb-1">
                        Shreyansh Singh
                      </span>
                      <span className="text-xs text-slate-500 max-w-[220px] leading-relaxed font-sans">
                        Multidisciplinary Designer & Chemical Engineer
                      </span>
                    </div>

                    {/* Bottom Metadata & Admin upload note */}
                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>IIT BOMBAY '27</span>
                      <a 
                        href="/admin/dashboard" 
                        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Upload photo</span>
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Hover Quick Edit Badge (links to admin) */}
                <a
                  href="/admin/dashboard"
                  className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5"
                  title="Upload or change image in Admin Console"
                >
                  <Camera size={13} className="text-indigo-600" />
                  <span>Update Photo</span>
                </a>
              </div>
            </div>

            {/* Sub-caption below photo */}
            <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>DESIGN PHILOSOPHY</span>
              <span className="text-slate-700 font-bold">SYSTEMS × ART</span>
            </div>
          </div>

          {/* ------------------------------------------------------
              BENTO CARD 3: ABOUT ME & THE CREED (Span 6)
              Integrated from the former bottom section!
             ------------------------------------------------------ */}
          <div className="lg:col-span-6 bento-card p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Compass size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider">
                      BIOGRAPHY & CREED
                    </span>
                    <h3 className="display-font text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      The Engineering × Design Matrix
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  SELF-TAUGHT
                </span>
              </div>

              {/* Bio Story */}
              <div 
                className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: aboutParagraph }}
              />

              {/* Quote spell */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs italic text-slate-700 leading-relaxed relative">
                <span className="text-indigo-400 font-serif text-2xl absolute -top-1.5 left-3">“</span>
                <p className="pl-3">
                  I believe in learning by breaking things, shipping actual work, and designing at the intersection of engineering systems and creative aesthetics.
                </p>
              </div>
            </div>

            {/* Milestones checklist */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                CORE MILESTONES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                    <span className="truncate">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------
              BENTO CARD 4: 3D CREATIVE SUITE MATRIX (Span 6)
              Photoshop, Illustrator, DaVinci Resolve interactive 3D!
             ------------------------------------------------------ */}
          <div className="lg:col-span-6 bento-card flex flex-col">
            <Software3DLogos />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;