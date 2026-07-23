import React, { Suspense, useContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CursorProvider } from './context/CursorContext';
import { MousePositionProvider } from './context/MousePositionContext';
import { Cursor, Spotlight } from './components/Cursor';
import { Header } from './portfolio/components/Header';
import { Hero } from './portfolio/components/Hero';
import { WorkCarousel } from './portfolio/components/WorkCarousel';
import { FeaturedWorksTable } from './portfolio/components/FeaturedWorksTable';
import { Work } from './portfolio/components/WorkSection';
import { Skills } from './portfolio/components/Skills';
import { Experience } from './portfolio/components/Experience';
import { Background } from './portfolio/components/Background';
import { Footer } from './portfolio/components/Footer';
import { usePortfolioData } from './portfolio/hooks/usePortfolioData';

// Code-split lazy loaded admin bundle pages
const Login = React.lazy(() => import('./admin/pages/Login'));
const Dashboard = React.lazy(() => import('./admin/pages/Dashboard'));

// Auth Guard Wrapper for Admin Dashboard routes
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// React Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.2rem', padding: '2rem', textAlign: 'center' }}>
          <h2 className="display-font" style={{ color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold' }}>Something went wrong</h2>
          <p style={{ color: '#a1a1aa', maxWidth: '500px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the portfolio."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            style={{ marginTop: '1rem', padding: '0.65rem 1.8rem', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple clean loading fallbacks for Admin module loading
const AdminLoadingScreen = () => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#09090b', alignItems: 'center', justifyContent: 'center' }}>
    <div className="display-font" style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '0.1em', animation: 'pulse 1.5s infinite' }}>
      LOADING ADMIN CONSOLE...
    </div>
  </div>
);

// High-class Skeleton Loader representing the editorial layout
const PortfolioSkeleton = () => (
  <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
    {/* Header line placeholder */}
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
      <div style={{ width: '120px', height: '20px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ width: '60px', height: '20px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
        <div style={{ width: '60px', height: '20px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
        <div style={{ width: '60px', height: '20px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
      </div>
    </div>
    
    {/* Hero layout placeholder */}
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '5rem' }}>
      <div style={{ width: '80%', height: '54px', backgroundColor: '#1A1A1E', borderRadius: '2px', animation: 'pulse 2s infinite' }} />
      <div style={{ width: '50%', height: '54px', backgroundColor: '#1A1A1E', borderRadius: '2px', animation: 'pulse 2s infinite' }} />
      <div style={{ width: '60%', height: '20px', backgroundColor: '#1A1A1E', borderRadius: '2px', marginTop: '1rem' }} />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ width: '120px', height: '40px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
        <div style={{ width: '120px', height: '40px', backgroundColor: '#1A1A1E', borderRadius: '2px' }} />
      </div>
    </div>
  </div>
);

// Scroll Progress Bar Tracker Component
const ScrollProgressBar = ({ activeSection, showLabel, sectionOffsets }) => {
  const sections = [
    { id: 'hero', name: 'Intro' },
    { id: 'work', name: 'Projects' },
    { id: 'skills', name: 'Skills' },
    { id: 'experience', name: 'Experience' },
    { id: 'background', name: 'Education' }
  ];

  return (
    <div className="scroll-progress-line-container">
      <div className="scroll-progress-bg" />
      <div className="scroll-progress-fill" />
      <div className="scroll-progress-tip" />
      
      {sections.map((sec) => {
        const percent = sectionOffsets[sec.id] || 0;
        const isActive = activeSection === sec.id;
        return (
          <React.Fragment key={sec.id}>
            <div 
              className={`section-marker-dot ${isActive ? 'active' : ''}`}
              style={{ top: `${percent}%` }}
            />
            <span 
              className={`section-marker-label ${isActive && showLabel ? 'visible' : ''}`}
              style={{ top: `${percent}%` }}
            >
              {sec.name}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Scroll Horizontal Divider Component
const ScrollDivider = () => {
  const dividerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (dividerRef.current) {
      observer.observe(dividerRef.current);
    }

    return () => {
      if (dividerRef.current) {
        observer.unobserve(dividerRef.current);
      }
    };
  }, []);

  return (
    <div className="horizontal-divider-container">
      <div 
        ref={dividerRef} 
        className={`horizontal-divider ${isActive ? 'active' : ''}`} 
      />
    </div>
  );
};

// Visitor Main Portfolio Wrapper
const PortfolioHome = () => {
  const { portfolioData, isLoading, error } = usePortfolioData();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('hero');
  const [lastActiveSection, setLastActiveSection] = useState('');
  const [showLabel, setShowLabel] = useState(false);
  const [sectionOffsets, setSectionOffsets] = useState({
    hero: 0,
    work: 30,
    skills: 55,
    experience: 75,
    background: 90
  });

  // Handle scroll tracking, blend shifts, active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressFraction = docHeight > 0 ? scrollY / docHeight : 0;
      const progressPercent = Math.min(100, Math.max(0, progressFraction * 100));

      // 1. Update scroll progress CSS custom property
      document.documentElement.style.setProperty('--scroll-progress', progressPercent.toFixed(2));

      // 2. Update split background blend position (shifts slightly: 42.5% to 57.5%)
      const blendPos = 42.5 + progressFraction * 15;
      document.documentElement.style.setProperty('--split-blend-position', `${blendPos.toFixed(2)}%`);

      // 3. Active Section Tracking
      const sections = ['hero', 'work', 'skills', 'experience', 'background'];
      let currentSection = 'hero';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(prev => prev !== currentSection ? currentSection : prev);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show progress indicator label briefly when section changes
  useEffect(() => {
    if (activeSection && activeSection !== lastActiveSection) {
      setLastActiveSection(activeSection);
      setShowLabel(true);
      const timer = setTimeout(() => setShowLabel(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [activeSection, lastActiveSection]);

  // Dynamically calculate markers top percentages
  useEffect(() => {
    const measureSectionPositions = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const sections = ['hero', 'work', 'skills', 'experience', 'background'];
      const offsets = {};
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          offsets[id] = Math.min(100, Math.max(0, (el.offsetTop / docHeight) * 100));
        }
      });
      setSectionOffsets(prev => ({ ...prev, ...offsets }));
    };

    if (!isLoading && portfolioData) {
      const timer = setTimeout(measureSectionPositions, 500);
      window.addEventListener('resize', measureSectionPositions);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', measureSectionPositions);
      };
    }
  }, [isLoading, portfolioData]);

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
        <h2 className="display-font" style={{ color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold' }}>Connection Error</h2>
        <p style={{ color: '#a1a1aa', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {error.message || "Could not load portfolio contents. Make sure your database credentials and internet connection are correct."}
        </p>
      </div>
    );
  }

  // Handle double click or click to redirect to admin
  const handleAdminRedirect = () => {
    navigate('/admin/dashboard');
  };

  // Track whether user has scrolled past the Hero panel
  const heroPanelRef = useRef(null);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    if (!heroPanelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-90px 0px 0px 0px' }
    );
    observer.observe(heroPanelRef.current);
    return () => observer.disconnect();
  }, [isLoading, portfolioData]);

  return (
    <>
      {/* Primary vertical scroll-linked progress tracker */}
      {!isLoading && portfolioData && (
        <ScrollProgressBar 
          activeSection={activeSection} 
          showLabel={showLabel} 
          sectionOffsets={sectionOffsets} 
        />
      )}

      {/* Floating header — visible after scrolling past hero */}
      {isPastHero && <Header floating={true} />}

      <div className="page-panels-wrapper">
        {/* PANEL 1: Hero + Work Carousel (Combined Dark Panel) */}
        <div className="page-panel page-panel--dark page-panel--hero-combined" style={{ position: 'relative' }}>
          {/* Target for header observer */}
          <div ref={heroPanelRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none' }} />

          {/* Organic SVG Filter for Blobs */}
          <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
            <filter id="organic-blob-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise">
                <animate attributeName="baseFrequency" values="0.012;0.018;0.012" dur="30s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          {/* Edge-anchored Ambient Blobs */}
          <div className="ambient-blobs-container">
            <div className="organic-blob blob-a" />
            <div className="organic-blob blob-b" />
            <div className="organic-blob blob-c" />
            <div className="organic-blob blob-d" />
          </div>

          {/* Embedded header inside hero panel */}
          <Header floating={false} />

          <Hero heroData={portfolioData?.hero} isLoading={isLoading} />

          {!isLoading && portfolioData && (
            <div className="hero-carousel-section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', paddingBottom: '2rem' }}>
              <Spotlight />
              <WorkCarousel carouselData={portfolioData.workCarousel} />
            </div>
          )}
        </div>

        {!isLoading && portfolioData && (
          <>
            {/* PANEL 2: Selected Works categories (Dark) */}
            <div className="page-panel page-panel--dark">
              <Spotlight />
              <Work portfolioData={portfolioData} />
            </div>

            {/* PANEL 3: Featured Works Table (Light) */}
            <div className="page-panel page-panel--light">
              <FeaturedWorksTable tableData={portfolioData.featuredWorksTable} />
            </div>

            {/* PANEL 5: Skills (Dark) */}
            <div className="page-panel page-panel--dark">
              <Spotlight />
              <Skills skillsData={portfolioData.skills} />
            </div>

            {/* PANEL 6: Experience (Dark) */}
            <div className="page-panel page-panel--dark">
              <Spotlight />
              <Experience experienceData={portfolioData.experience} />
            </div>

            {/* PANEL 7: Background (Light) */}
            <div className="page-panel page-panel--light">
              <Background backgroundData={portfolioData.background} />
            </div>

            {/* FOOTER (Dark) */}
            <div className="page-panel page-panel--dark page-panel--footer">
              <Footer footerData={portfolioData.footer} onSecretClick={handleAdminRedirect} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CursorProvider>
          <MousePositionProvider>
            {/* Custom lagging cursor portal */}
            <Cursor />

            <Routes>
              {/* Public Portfolio Route */}
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <PortfolioHome />
                  </ErrorBoundary>
                }
              />

              {/* Admin Login Route */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<AdminLoadingScreen />}>
                    <Login />
                  </Suspense>
                }
              />

              {/* Admin Dashboard Protected Route */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingScreen />}>
                      <Dashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Wildcard Catchall redirects to homepage */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MousePositionProvider>
        </CursorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
