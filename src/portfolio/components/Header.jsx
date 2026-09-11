import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CursorContext } from '../../context/CursorContext';
import { X } from 'lucide-react';

export const Header = ({ floating = false, isPastHero = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  useEffect(() => {
    if (!floating) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If scrolling down past 120px and delta > 6px, hide floating nav
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current + 6) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsScrollingDown(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [floating]);

  // Lock body scroll when mobile menu is open
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

  // Close mobile menu on Escape key press
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
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  const isHidden = floating && (!isPastHero || (isScrollingDown && !isMobileMenuOpen));
  const headerClass = floating 
    ? `header header--floating ${isHidden ? 'header--hidden' : ''}` 
    : 'header header--embedded';

  return (
    <>
      <header 
        className={headerClass} 
        id={floating ? 'floating-header' : 'main-header'} 
        data-nav="true"
        style={{ 
          zIndex: 9999,
          isolation: 'isolate',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: floating ? 'paint' : 'layout'
        }}
      >
        <div className="container header-container">
          <a
            href="#hero"
            className="logo display-font"
            onMouseEnter={(e) => {
              setMagneticElement(e.currentTarget);
              triggerHover('Home');
            }}
            onMouseLeave={triggerDefault}
          >
            Shreyansh Singh<span style={{ color: 'var(--accent-amber)' }}>.</span>
          </a>
          
          <button
            className={`mobile-nav-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls={floating ? 'floating-mobile-drawer' : 'main-mobile-drawer'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <ul 
              id={floating ? 'floating-primary-nav' : 'main-primary-nav'}
              className="nav-list"
            >
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="nav-link"
                    onMouseEnter={(e) => {
                      setMagneticElement(e.currentTarget);
                      triggerHover(item.label);
                    }}
                    onMouseLeave={triggerDefault}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-cta">
            <a
              href="#contact"
              className="btn btn-gradient"
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Chat');
              }}
              onMouseLeave={triggerDefault}
            >
              Let's Connect
            </a>
          </div>
        </div>
      </header>

      {/* Portaled Mobile Slide-over Drawer */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id={floating ? 'floating-mobile-drawer' : 'main-mobile-drawer'}
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden={!isMobileMenuOpen}
        >
          <div 
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-drawer-header">
              <span className="logo display-font" style={{ fontSize: '1.25rem' }}>
                Shreyansh Singh<span style={{ color: 'var(--accent-amber)' }}>.</span>
              </span>
              <button
                className="mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <ul>
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="mobile-drawer-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mobile-drawer-footer">
              <a
                href="#contact"
                className="btn btn-gradient"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex' }}
              >
                Let's Connect
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
