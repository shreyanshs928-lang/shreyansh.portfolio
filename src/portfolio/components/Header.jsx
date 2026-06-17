import React, { useState, useEffect, useContext } from 'react';
import { CursorContext } from '../../context/CursorContext';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="main-header">
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
          aria-label="Toggle Navigation"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <nav>
          <ul className={`nav-list ${isMobileMenuOpen ? 'open' : ''}`}>
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
