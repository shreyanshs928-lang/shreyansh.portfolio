import React, { useContext, useState, useEffect } from 'react';
import { CursorContext } from '../../context/CursorContext';
import { 
  Linkedin, 
  Instagram, 
  Mail, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Clock, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const BehanceIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
    <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
    <line x1="14" y1="7" x2="19" y2="7"/>
  </svg>
);

export const Footer = ({ footerData, onSecretClick }) => {
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [copied, setCopied] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  const tagline = footerData?.tagline || "Designing visual brands, editorial systems, and digital interfaces.";
  const linkedinUrl = footerData?.linkedinUrl || "https://linkedin.com";
  const instagramUrl = footerData?.instagramUrl || "https://instagram.com";
  const behanceUrl = footerData?.behanceUrl || "https://behance.net";
  const email = footerData?.email || "shreyansh@example.com";
  const copyright = footerData?.copyright || "© 2026 Shreyansh Singh · Crafted with intentionality at IIT Bombay";

  // Live Mumbai Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setTimeStr(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-20 pb-12 overflow-hidden relative">
      {/* Background ambient glow */}
      <div 
        className="absolute bottom-0 right-0 w-[500px] height-[500px] rounded-full pointer-events-none opacity-20 filter blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, #F97316 70%, transparent 100%)'
        }}
      />

      <div className="container relative z-10">
        {/* Main CTA Section */}
        <div className="max-w-3xl mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for select freelance & summer 2026 opportunities</span>
          </div>

          <h2 className="display-font text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Have a project in mind? <br />
            <span className="gradient-text">Let's build something unforgettable.</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Whether it's flight telemetry dashboards, brand system revamps, or high-octane motion campaigns, let's talk.
          </p>

          {/* Quick Contact & Copy Email Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={`mailto:${email}`}
              className="btn btn-gradient px-8 py-4 rounded-full text-sm font-bold shadow-xl"
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Email');
              }}
              onMouseLeave={triggerDefault}
            >
              <Mail size={16} />
              <span>Send Email</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="btn bg-white/10 hover:bg-white/15 text-white border border-white/15 px-6 py-4 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Copy');
              }}
              onMouseLeave={triggerDefault}
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Email Copied!' : email}</span>
            </button>
          </div>
        </div>

        {/* Middle Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-y border-white/10 mb-12">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="display-font text-xl font-bold text-white flex items-center gap-2">
              Shreyansh Singh<span className="text-orange-500">.</span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Col 2: Social Connect */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 font-sans">
              Social Links
            </span>
            <div className="flex flex-col gap-2 text-xs">
              {behanceUrl && (
                <a
                  href={behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-2 transition-colors py-1"
                >
                  <BehanceIcon size={15} /> Behance Case Studies
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-2 transition-colors py-1"
                >
                  <Linkedin size={15} /> LinkedIn Profile
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-2 transition-colors py-1"
                >
                  <Instagram size={15} /> Instagram Content
                </a>
              )}
            </div>
          </div>

          {/* Col 3: Location & Time */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 font-sans">
              Location & Time
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="font-semibold text-white">Mumbai, India</p>
              <p className="text-slate-400">Indian Institute of Technology Bombay</p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono pt-1">
                <Clock size={13} />
                <span>{timeStr || '1:16 PM IST'} (GMT+5:30)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{copyright}</p>

          <button
            onClick={onSecretClick}
            className="hover:text-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-[11px]"
            title="Admin Console"
          >
            <span>Console Access</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
