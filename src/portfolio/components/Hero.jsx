import React, { useContext, useState } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { 
  ArrowDown, 
  Download, 
  Linkedin, 
  Instagram, 
  Mail, 
  Camera, 
  ArrowUpRight
} from 'lucide-react';

// Behance custom SVG icon
const BehanceIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
    <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
    <line x1="14" y1="7" x2="19" y2="7"/>
  </svg>
);

export const Hero = ({ heroData }) => {
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [imageHover, setImageHover] = useState(false);

  const bio = heroData?.bioText || "I design across UI/UX, motion, print, and social — blending an engineer's precision with a designer's instinct. Currently building creative systems and flight telemetry at IIT Bombay.";
  const resumeLink = heroData?.resumeLink || "https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing";
  const social = heroData?.socialLinks || {};
  const portrait = heroData?.portraitImage;
  const isCustomPhoto = portrait && !portrait.startsWith('svg:');

  return (
    <section id="hero" className="relative pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden">
      <div className="container relative z-10">
        
        {/* Availability & Location Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-8 border-b border-slate-200/60 mb-10">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for select projects & summer 2026 roles</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>IIT Bombay · Mumbai, India</span>
            <span>·</span>
            <span>Chemical Eng. '27</span>
          </div>
        </div>

        {/* Hero Main Composition: Big Name & Image Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Big Name & Short Intro */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1">
            {/* Big Name */}
            <h1 className="display-font text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-extrabold tracking-[-0.035em] text-slate-900 leading-[0.92] uppercase select-none">
              Shreyansh<br />
              <span className="text-slate-800">Singh</span>
            </h1>

            {/* Short Intro placed directly at the bottom of the name */}
            <div className="mt-7 space-y-6 max-w-xl">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {bio}
              </p>

              {/* Action Buttons & Social Links */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#work"
                  className="btn btn-primary px-6 py-3.5 text-sm rounded-full shadow-md"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Explore');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  <span>Explore Selected Works</span>
                  <ArrowDown size={15} />
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

                {/* Social Links */}
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

              {/* Disciplines Chips */}
              <div className="pt-3 flex flex-wrap gap-2 text-xs text-slate-500 font-medium">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">UI/UX Systems</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">Flight Telemetry</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">Brand Identity</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">Motion & Video</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">Editorial Print</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Image Placeholder */}
          <div className="lg:col-span-5 order-2">
            <div 
              className="relative w-full max-w-sm sm:max-w-md mx-auto group"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              {/* Image Frame with 4:5 Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                
                {isCustomPhoto ? (
                  <img
                    src={portrait}
                    alt="Shreyansh Singh"
                    className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  /* Editorial Photo Placeholder Frame */
                  <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200/70 text-slate-700">
                    {/* Top Blueprint Header */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 gap-2 mb-2">
                      <span className="text-[10px] tracking-wider uppercase">PORTRAIT</span>
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
                      <span className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
                        Multidisciplinary Designer & Chemical Engineer
                      </span>
                    </div>

                    {/* Bottom Metadata & Admin upload note */}
                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>IIT Bombay · Class of '27</span>
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
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
