import React, { Suspense, useContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CursorProvider } from './context/CursorContext';
import { MousePositionProvider } from './context/MousePositionContext';
import { Cursor, Spotlight } from './components/Cursor';
import { Header } from './portfolio/components/Header';
import { Hero } from './portfolio/components/Hero';
import { WorkCarousel } from './portfolio/components/WorkCarousel';
import { Disciplines } from './portfolio/components/Disciplines';
import { Work } from './portfolio/components/WorkSection';
import { FeaturedWorksTable } from './portfolio/components/FeaturedWorksTable';
import { About } from './portfolio/components/About';
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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAF9', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.2rem', padding: '2rem', textAlign: 'center' }}>
          <h2 className="display-font" style={{ color: '#EF4444', fontSize: '1.8rem', fontWeight: 'bold' }}>Something went wrong</h2>
          <p style={{ color: '#475569', maxWidth: '500px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the portfolio."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            style={{ marginTop: '1rem', padding: '0.75rem 2rem', cursor: 'pointer', borderRadius: '9999px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple clean loading fallback for Admin console
const AdminLoadingScreen = () => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#09090b', alignItems: 'center', justifyContent: 'center' }}>
    <div className="display-font" style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '0.1em', animation: 'pulse 1.5s infinite' }}>
      LOADING ADMIN CONSOLE...
    </div>
  </div>
);

// Vertical Scroll Progress Tracker
const ScrollProgressBar = ({ activeSection, showLabel, sectionOffsets }) => {
  const sections = [
    { id: 'hero', name: 'Intro' },
    { id: 'work', name: 'Works' },
    { id: 'disciplines', name: 'Disciplines' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    { id: 'experience', name: 'Timeline' },
    { id: 'background', name: 'Education' },
    { id: 'contact', name: 'Contact' }
  ];

  return (
    <div className="scroll-progress-line-container">
      <div className="scroll-progress-fill" />
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

// Visitor Main Portfolio Wrapper
const PortfolioHome = () => {
  const { portfolioData, isLoading, error } = usePortfolioData();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('hero');
  const [lastActiveSection, setLastActiveSection] = useState('');
  const [showLabel, setShowLabel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sectionOffsets, setSectionOffsets] = useState({
    hero: 0,
    work: 20,
    disciplines: 40,
    about: 55,
    skills: 70,
    experience: 82,
    background: 92,
    contact: 98
  });

  // Track active section and scroll progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressFraction = docHeight > 0 ? scrollY / docHeight : 0;
      const progressPercent = Math.min(100, Math.max(0, progressFraction * 100));

      document.documentElement.style.setProperty('--scroll-progress', progressPercent.toFixed(2));

      const sections = ['hero', 'work', 'disciplines', 'about', 'skills', 'experience', 'background', 'contact'];
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

  // Show section label briefly on change
  useEffect(() => {
    if (activeSection && activeSection !== lastActiveSection) {
      setLastActiveSection(activeSection);
      setShowLabel(true);
      const timer = setTimeout(() => setShowLabel(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [activeSection, lastActiveSection]);

  // Dynamically calculate section positions
  useEffect(() => {
    const measureSectionPositions = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const sections = ['hero', 'work', 'disciplines', 'about', 'skills', 'experience', 'background', 'contact'];
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
      const timer = setTimeout(measureSectionPositions, 400);
      window.addEventListener('resize', measureSectionPositions);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', measureSectionPositions);
      };
    }
  }, [isLoading, portfolioData]);

  // Track scroll past hero to reveal floating header
  const heroPanelRef = useRef(null);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    if (!heroPanelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(heroPanelRef.current);
    return () => observer.disconnect();
  }, [isLoading, portfolioData]);

  const handleAdminRedirect = () => {
    navigate('/admin/dashboard');
  };

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#FAFAF9', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
        <h2 className="display-font" style={{ color: '#EF4444', fontSize: '1.8rem', fontWeight: 'bold' }}>Connection Error</h2>
        <p style={{ color: '#475569', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {error.message || "Could not load portfolio contents. Make sure your database credentials and internet connection are correct."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Light dot grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0 light-dot-grid opacity-60" />

      {/* Primary vertical scroll tracker */}
      {!isLoading && portfolioData && (
        <ScrollProgressBar 
          activeSection={activeSection} 
          showLabel={showLabel} 
          sectionOffsets={sectionOffsets} 
        />
      )}

      {/* Floating header — reveals after scrolling past hero */}
      <Header floating={true} isPastHero={isPastHero} />

      <main className="relative z-10">
        {/* Top Embedded Header & Hero Container */}
        <div className="relative">
          <div ref={heroPanelRef} className="absolute top-0 left-0 w-full h-[85vh] pointer-events-none" />
          
          <Header floating={false} />

          <Hero heroData={portfolioData?.hero} isLoading={isLoading} />
        </div>

        {/* Featured Highlights Carousel */}
        {!isLoading && portfolioData?.workCarousel && (
          <WorkCarousel carouselData={portfolioData.workCarousel} />
        )}

        {/* The 6 Disciplines Interactive Matrix */}
        <Disciplines onSelectCategory={setSelectedCategory} />

        {/* Selected Works Portfolio Command Center */}
        {!isLoading && portfolioData && (
          <Work 
            portfolioData={portfolioData} 
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {/* Project Directory Archive Table */}
        {!isLoading && portfolioData?.featuredWorksTable && (
          <FeaturedWorksTable tableData={portfolioData.featuredWorksTable} />
        )}

        {/* About & The Engineering Creed */}
        {!isLoading && portfolioData && (
          <About aboutData={portfolioData.about} profileData={portfolioData.profile} />
        )}

        {/* Capabilities & Skills Stack */}
        {!isLoading && portfolioData?.skills && (
          <Skills skillsData={portfolioData.skills} />
        )}

        {/* Career & Leadership Experience Timeline */}
        {!isLoading && portfolioData?.experience && (
          <Experience experienceData={portfolioData.experience} />
        )}

        {/* Academic Foundation & Honors */}
        {!isLoading && portfolioData?.background && (
          <Background backgroundData={portfolioData.background} />
        )}

        {/* Creative Footer */}
        <Footer 
          footerData={portfolioData?.footer} 
          onSecretClick={handleAdminRedirect} 
        />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CursorProvider>
          <MousePositionProvider>
            {/* Custom precision magnetic cursor */}
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
