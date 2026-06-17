import React, { Suspense, useContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CursorProvider } from './context/CursorContext';
import { MousePositionProvider } from './context/MousePositionContext';
import { Cursor } from './components/Cursor';
import { Header } from './portfolio/components/Header';
import { Hero } from './portfolio/components/Hero';
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
    work: 40,
    skills: 60,
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

      setActiveSection(currentSection);
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

  return (
    <>
      {/* 1. Base Noise Film Grain Filter Overlay */}
      <div className="noise-overlay" />

      {/* 2. GPU-animated background radial gradient mesh canvas */}
      <div className="bg-mesh-canvas-animated" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />

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

      {/* Primary vertical scroll-linked progress tracker */}
      {!isLoading && portfolioData && (
        <ScrollProgressBar 
          activeSection={activeSection} 
          showLabel={showLabel} 
          sectionOffsets={sectionOffsets} 
        />
      )}

      {/* 3. Sticky header nav */}
      <Header />

      {/* 4. Modular Visual Sections mapped to Firestore data */}
      <main>
        <Hero heroData={portfolioData?.hero} isLoading={isLoading} />
        
        {!isLoading && portfolioData && (
          <>
            <ScrollDivider />
            <Work portfolioData={{ work: portfolioData.work }} />
            
            <ScrollDivider />
            <Skills skillsData={portfolioData.skills} />
            
            <ScrollDivider />
            <Experience experienceData={portfolioData.experience} />
            
            <ScrollDivider />
            <Background backgroundData={portfolioData.background} />
          </>
        )}
      </main>

      {/* 5. Footer with secret admin route trigger */}
      {!isLoading && portfolioData && (
        <Footer footerData={portfolioData.footer} onSecretClick={handleAdminRedirect} />
      )}
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
              <Route path="/" element={<PortfolioHome />} />

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
