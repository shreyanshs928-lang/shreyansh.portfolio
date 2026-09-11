import React, { useState, useEffect, useRef, useContext } from 'react';
import { CursorContext } from '../../context/CursorContext';

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
    <header 
      className={headerClass} 
      id={floating ? 'floating-header' : 'main-header'} 
      data-nav="true"
      style={{ 
        zIndex: 9999,
        isolation: 'isolate',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        contain: 'paint'
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
          aria-controls={floating ? 'floating-primary-nav' : 'main-primary-nav'}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <nav aria-label="Primary Navigation">
          <ul 
            id={floating ? 'floating-primary-nav' : 'main-primary-nav'}
            className={`nav-list ${isMobileMenuOpen ? 'open' : ''}`}
          >
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
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
  );
};
