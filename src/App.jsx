import React, { Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CursorProvider } from './context/CursorContext';
import { Cursor } from './components/Cursor';
import { Header } from './portfolio/components/Header';
import { Hero } from './portfolio/components/Hero';
import { About } from './portfolio/components/About';
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

// Visitor Main Portfolio Wrapper
const PortfolioHome = () => {
  const { portfolioData, isLoading, error } = usePortfolioData();
  const navigate = useNavigate();

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

      {/* 3. Sticky header nav */}
      <Header />

      {/* 4. Modular Visual Sections mapped to Firestore data */}
      <main>
        <Hero heroData={portfolioData?.hero} isLoading={isLoading} />
        
        {!isLoading && portfolioData && (
          <>
            <About profileData={{ about: portfolioData.about }} />
            
            {/* Render Work Projects (filter draft vs published) */}
            <Work portfolioData={{ work: portfolioData.work }} />
            
            <Skills skillsData={portfolioData.skills} />
            <Experience experienceData={portfolioData.experience} />
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
        </CursorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
