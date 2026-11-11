import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CursorContext } from '../../context/CursorContext';
import { ArrowUpRight, Sparkles, Menu, X } from 'lucide-react';

export const Header = ({ floating = false, isPastHero = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  useEffect(() => {
    if (!floating) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current + 8) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsScrollingDown(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [floating]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Selected Works', href: '#work' },
    { label: 'Disciplines', href: '#disciplines' },
    { label: 'About & Creed', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Timeline', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  const isHidden = floating && (!isPastHero || (isScrollingDown && !isMobileMenuOpen));

  // Render floating pill header
  if (floating) {
    return (
      <header
        className={`header header--floating ${isHidden ? 'header--hidden' : ''}`}
        id="floating-header"
        data-nav="true"
      >
        <div className="header-pill">
          <a
            href="#hero"
            className="logo"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Home');
            }}
            onMouseLeave={triggerDefault}
          >
            <span className="font-bold tracking-tight">Shreyansh</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block mb-0.5" />
          </a>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover(item.label.split(' ')[0]);
                }}
                onMouseLeave={triggerDefault}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* Magnetic Contact Button */}
          <a
            href="#contact"
            className="btn btn-primary text-xs py-1.5 px-3.5 rounded-full hidden sm:inline-flex"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Contact');
            }}
            onMouseLeave={triggerDefault}
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={13} />
          </a>

          {/* Mobile menu trigger button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Fullscreen Drawer */}
        {isMobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[10005] bg-white/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <a href="#hero" className="logo text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                Shreyansh Singh<span className="text-orange-500">.</span>
              </a>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 py-8">
              {navItems.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="display-font text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-xs text-indigo-500 font-mono mr-3">0{idx + 1}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Available for Q3/Q4 Creative Work
              </div>
              <a
                href="#contact"
                className="btn btn-primary w-full py-3 text-center rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start a Conversation
              </a>
            </div>
          </div>,
          document.body
        )}
      </header>
    );
  }

  // Embedded Header inside the Top of Hero
  return (
    <header className="header header--embedded w-full pt-6 pb-4" id="main-header" data-nav="true">
      <div className="container flex items-center justify-between">
        <a
          href="#hero"
          className="logo text-xl"
          onMouseEnter={(e) => {
            setMagneticElement(e.currentTarget);
            triggerHover('Home');
          }}
          onMouseLeave={triggerDefault}
        >
          <span className="font-extrabold tracking-tight text-slate-900">Shreyansh Singh</span>
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block mb-1" />
        </a>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-medium text-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Chemical Eng. + Design · IIT Bombay</span>
        </div>

        {/* Right Action: Links & Talk */}
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1">
            <a href="#work" className="nav-link">Work</a>
            <a href="#disciplines" className="nav-link">Disciplines</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#experience" className="nav-link">Timeline</a>
          </nav>

          <a
            href="#contact"
            className="btn btn-primary text-xs sm:text-sm py-2 px-4 rounded-full"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Contact');
            }}
            onMouseLeave={triggerDefault}
          >
            <span>Get in Touch</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
