import React, { useState, useEffect } from 'react';

// Specific high-fidelity project SVGs with a clean, light, architectural aesthetic
const placeholderSvgs = {
  'ui-2': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>
      
      {/* Background Blueprint Grid */}
      <defs>
        <pattern id="ui2-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ui2-grid)" />

      {/* Main Glass Panel */}
      <rect x="24" y="24" width="552" height="327" rx="16" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>
      
      {/* Top Header Bar */}
      <rect x="24" y="24" width="552" height="46" rx="16" fill="#F1F5F9" fillOpacity="0.7"/>
      <circle cx="48" cy="47" r="4.5" fill="#EF4444"/>
      <circle cx="64" cy="47" r="4.5" fill="#F59E0B"/>
      <circle cx="80" cy="47" r="4.5" fill="#10B981"/>
      <text x="104" y="52" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.05em">
        AETHER TELEMETRY · MISSION CONTROL OS
      </text>
      <rect x="475" y="38" width="85" height="18" rx="9" fill="#10B981" fillOpacity="0.12"/>
      <circle cx="487" cy="47" r="3" fill="#10B981"/>
      <text x="496" y="50" fill="#059669" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700">FLIGHT LIVE</text>

      {/* Left: Attitude & Gyro Radar Indicator */}
      <g transform="translate(44, 90)">
        <rect width="210" height="235" rx="12" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="16" y="26" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600">ORIENTATION & ATTITUDE</text>
        
        {/* Radar Circles */}
        <circle cx="105" cy="130" r="72" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <circle cx="105" cy="130" r="48" fill="rgba(99, 102, 241, 0.04)" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5"/>
        <circle cx="105" cy="130" r="24" fill="rgba(99, 102, 241, 0.08)" stroke="#6366F1" strokeWidth="1.5"/>
        
        {/* Axis Crosshairs */}
        <line x1="25" y1="130" x2="185" y2="130" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>
        <line x1="105" y1="50" x2="105" y2="210" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>
        
        {/* Pitch Vector */}
        <line x1="105" y1="130" x2="148" y2="92" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="148" cy="92" r="4" fill="#F97316"/>
        <text x="105" y="222" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="700">PITCH +32.4° · YAW 0.02°</text>
      </g>

      {/* Right Column: Telemetry Cards & Altitude Chart */}
      <g transform="translate(270, 90)">
        {/* Stat Card 1: Apogee */}
        <rect x="0" y="0" width="138" height="68" rx="10" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="22" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.05em">MAX APOGEE</text>
        <text x="14" y="48" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="800">10,420 FT</text>
        <text x="14" y="60" fill="#10B981" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600">↑ Target Achieved</text>

        {/* Stat Card 2: Velocity */}
        <rect x="150" y="0" width="138" height="68" rx="10" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="164" y="22" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.05em">PEAK VELOCITY</text>
        <text x="164" y="48" fill="#4F46E5" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="800">MACH 1.12</text>
        <text x="164" y="60" fill="#6366F1" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600">Supersonic Burst</text>

        {/* Telemetry Chart Curve */}
        <rect x="0" y="80" width="288" height="155" rx="10" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="104" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.05em">TRAJECTORY PROFILE</text>
        
        {/* Subtle grid lines inside chart */}
        <line x1="14" y1="130" x2="274" y2="130" stroke="rgba(15, 23, 42, 0.05)"/>
        <line x1="14" y1="165" x2="274" y2="165" stroke="rgba(15, 23, 42, 0.05)"/>
        <line x1="14" y1="200" x2="274" y2="200" stroke="rgba(15, 23, 42, 0.08)"/>

        {/* Parabolic Flight Curve */}
        <path d="M 20 200 Q 110 90 180 115 T 270 145" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="180" cy="115" r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5"/>
        <text x="190" y="112" fill="#F97316" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="700">APOGEE EVENT</text>
        <path d="M 20 200 Q 110 90 180 115 T 270 145 L 270 200 L 20 200 Z" fill="url(#altitudeGrad)" opacity="0.12"/>
        <defs>
          <linearGradient id="altitudeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5"/>
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </g>
    </svg>
  ),
  'branding-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>
      
      {/* Background subtle geometric canvas */}
      <defs>
        <pattern id="brand-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="rgba(15, 23, 42, 0.06)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand-grid)" />

      {/* Main Presentation Surface */}
      <rect x="28" y="28" width="544" height="319" rx="16" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>

      {/* Construction Blueprint Circles (Golden Ratio / Geometry) */}
      <circle cx="210" cy="165" r="95" stroke="rgba(79, 70, 229, 0.12)" strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="210" cy="165" r="60" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1.5"/>
      <circle cx="210" cy="165" r="32" stroke="rgba(249, 115, 22, 0.25)" strokeWidth="1"/>
      <line x1="80" y1="165" x2="340" y2="165" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4"/>
      <line x1="210" y1="50" x2="210" y2="280" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4"/>
      
      {/* Stylized Logo Mark: Architectural 'A' */}
      <path d="M 160 215 L 210 95 L 260 215" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 182 170 L 238 170" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="210" cy="95" r="5" fill="#F97316"/>

      {/* Right Side: Identity Guide Specs */}
      <g transform="translate(340, 75)">
        <span className="card-tag">
          <rect x="0" y="0" width="100" height="22" rx="11" fill="rgba(79, 70, 229, 0.08)"/>
          <text x="50" y="15" textAnchor="middle" fill="#4F46E5" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700">BRAND SYSTEM</text>
        </span>

        <text x="0" y="58" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-0.02em">
          ALUMINATION
        </text>
        <text x="0" y="78" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" letterSpacing="0.08em">
          STUDENT-ALUMNI RELATIONS · IIT BOMBAY
        </text>

        <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(15, 23, 42, 0.08)"/>

        {/* Color Palette Swatches */}
        <text x="0" y="125" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">COLOR SPECIFICATION</text>
        <g transform="translate(0, 138)">
          <rect x="0" y="0" width="36" height="36" rx="8" fill="#4F46E5"/>
          <rect x="44" y="0" width="36" height="36" rx="8" fill="#F97316"/>
          <rect x="88" y="0" width="36" height="36" rx="8" fill="#0F172A"/>
          <rect x="132" y="0" width="36" height="36" rx="8" fill="#F1F5F9" stroke="rgba(15,23,42,0.1)"/>
        </g>
        
        {/* Dimension Notes */}
        <text x="0" y="205" fill="#94A3B8" fontFamily="Inter, sans-serif" fontSize="10">
          Grid Ratio: 1:1.618 · Clearance: 2X
        </text>
      </g>
    </svg>
  ),
  'print-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>

      {/* Book Spread Shadow & Spine */}
      <rect x="40" y="32" width="250" height="311" rx="6" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>
      <rect x="310" y="32" width="250" height="311" rx="6" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>

      {/* Left Page: Editorial Typography */}
      <g transform="translate(64, 60)">
        <text x="0" y="18" fill="#4F46E5" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em">SECTION 03 // PROPULSION JOURNAL</text>
        <text x="0" y="44" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="800">
          Hydrocarbon Thrust
        </text>
        <line x1="0" y1="56" x2="190" y2="56" stroke="#4F46E5" strokeWidth="2"/>

        {/* Text Columns Simulation */}
        <rect x="0" y="74" width="202" height="6" rx="2" fill="#E2E8F0"/>
        <rect x="0" y="86" width="180" height="6" rx="2" fill="#E2E8F0"/>
        <rect x="0" y="98" width="195" height="6" rx="2" fill="#E2E8F0"/>
        <rect x="0" y="110" width="150" height="6" rx="2" fill="#E2E8F0"/>

        {/* Chemical/Technical Vector Schematic */}
        <rect x="0" y="135" width="202" height="100" rx="8" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <circle cx="101" cy="185" r="28" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
        <line x1="50" y1="185" x2="152" y2="185" stroke="#CBD5E1"/>
        <line x1="101" y1="145" x2="101" y2="225" stroke="#CBD5E1"/>
        <circle cx="101" cy="185" r="6" fill="#F97316"/>
        <text x="101" y="222" textAnchor="middle" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600">INJECTOR MATRIX · FIG 4.2</text>

        <text x="0" y="262" fill="#94A3B8" fontFamily="Space Grotesk, monospace" fontSize="9">PG. 34</text>
      </g>

      {/* Right Page: Hero Graphic & Cover */}
      <g transform="translate(334, 60)">
        <rect x="0" y="0" width="202" height="150" rx="10" fill="#EEF2FF" stroke="rgba(79, 70, 229, 0.15)"/>
        <circle cx="101" cy="75" r="42" fill="rgba(249, 115, 22, 0.12)" stroke="#F97316" strokeWidth="1.5"/>
        <path d="M 80 75 Q 101 45 122 75 Q 101 105 80 75" fill="none" stroke="#4F46E5" strokeWidth="2"/>
        
        <text x="0" y="185" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="800">
          AETHER
        </text>
        <text x="0" y="204" fill="#F97316" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.08em">
          IIT BOMBAY PROPULSION GROUP
        </text>
        <text x="0" y="222" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9">
          Annual Research Journal · 4th Edition
        </text>
        <text x="180" y="262" fill="#94A3B8" fontFamily="Space Grotesk, monospace" fontSize="9">PG. 35</text>
      </g>
    </svg>
  ),
  'ui-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>
      
      {/* SaaS Dashboard Frame */}
      <rect x="24" y="24" width="552" height="327" rx="16" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>

      {/* Left Sidebar */}
      <rect x="24" y="24" width="110" height="327" rx="16" fill="#F1F5F9" fillOpacity="0.8"/>
      <circle cx="56" cy="56" r="14" fill="#4F46E5"/>
      <text x="56" y="60" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="800">E</text>
      <text x="78" y="60" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="700">E-CELL</text>

      {/* Nav links */}
      <rect x="36" y="95" width="86" height="26" rx="6" fill="#FFFFFF" stroke="rgba(15,23,42,0.06)"/>
      <text x="48" y="112" fill="#4F46E5" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700">Overview</text>
      <text x="48" y="145" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500">Startups</text>
      <text x="48" y="175" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500">Mentors</text>
      <text x="48" y="205" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500">Fund Pool</text>

      {/* Main Dashboard Canvas */}
      <g transform="translate(150, 44)">
        <text x="0" y="20" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="800">
          Incubator Portfolio Portal
        </text>
        <text x="0" y="38" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="10">
          Cohort 2025–26 Pipeline Status
        </text>

        {/* Metrics Row */}
        <g transform="translate(0, 52)">
          <rect x="0" y="0" width="120" height="64" rx="8" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
          <text x="12" y="20" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">INCUBATED</text>
          <text x="12" y="44" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="800">120+</text>
          <text x="12" y="56" fill="#10B981" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600">+18 this month</text>

          <rect x="132" y="0" width="120" height="64" rx="8" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
          <text x="144" y="20" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">APPLICANTS</text>
          <text x="144" y="44" fill="#4F46E5" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="800">1,420</text>
          <text x="144" y="56" fill="#4F46E5" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600">Record High</text>

          <rect x="264" y="0" width="128" height="64" rx="8" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
          <text x="276" y="20" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">CAPITAL COMMITTED</text>
          <text x="276" y="44" fill="#F97316" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="800">₹4.8 Cr</text>
          <text x="276" y="56" fill="#F97316" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600">Alumni Angels</text>
        </g>

        {/* Graph representation */}
        <g transform="translate(0, 130)">
          <rect x="0" y="0" width="392" height="145" rx="10" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
          <text x="14" y="24" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">MONTHLY APPLICATION GROWTH</text>
          
          {/* Bar Chart Visual */}
          <rect x="30" y="90" width="28" height="40" rx="4" fill="#CBD5E1"/>
          <rect x="75" y="70" width="28" height="60" rx="4" fill="#CBD5E1"/>
          <rect x="120" y="50" width="28" height="80" rx="4" fill="#818CF8"/>
          <rect x="165" y="35" width="28" height="95" rx="4" fill="#6366F1"/>
          <rect x="210" y="20" width="28" height="110" rx="4" fill="#4F46E5"/>
          <circle cx="224" cy="15" r="4" fill="#F97316"/>
        </g>
      </g>
    </svg>
  ),
  'print-2': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#FFF7ED' }}>
      <rect width="100%" height="100%" fill="#FFF7ED"/>
      
      {/* Festival Guide Cover */}
      <rect x="40" y="30" width="520" height="315" rx="16" fill="#FFFFFF" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="1"/>
      
      {/* Bold festival block header */}
      <rect x="40" y="30" width="520" height="90" rx="16" fill="#F97316"/>
      <text x="70" y="86" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="32" letterSpacing="-0.02em">
        MOOD INDIGO '25
      </text>
      <text x="430" y="82" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="11" letterSpacing="0.1em">
        OFFICIAL GUIDE
      </text>

      {/* Guide Internal Schedule Columns */}
      <g transform="translate(70, 150)">
        <text x="0" y="16" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700">STAGE 01 · GYMKHANA GROUNDS</text>
        <rect x="0" y="28" width="210" height="42" rx="6" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="46" fill="#4F46E5" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="700">18:00 – 20:00</text>
        <text x="14" y="60" fill="#0F172A" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600">Fusion Pro-Nite Concert</text>

        <rect x="0" y="80" width="210" height="42" rx="6" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="98" fill="#F97316" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="700">20:30 – 23:00</text>
        <text x="14" y="112" fill="#0F172A" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600">International EDM Arena</text>
      </g>

      <g transform="translate(320, 150)">
        <text x="0" y="16" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700">STAGE 02 · CONVOCATION HALL</text>
        <rect x="0" y="28" width="210" height="42" rx="6" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="46" fill="#10B981" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="700">11:00 – 14:00</text>
        <text x="14" y="60" fill="#0F172A" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600">National Choreonite Finals</text>

        <rect x="0" y="80" width="210" height="42" rx="6" fill="#F8FAFC" stroke="rgba(15, 23, 42, 0.06)"/>
        <text x="14" y="98" fill="#6366F1" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="700">15:00 – 17:30</text>
        <text x="14" y="112" fill="#0F172A" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600">Mono-Act & Theatre Drama</text>
      </g>
    </svg>
  ),
  'social-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#FAF5FF' }}>
      <rect width="100%" height="100%" fill="#FAF5FF"/>
      <rect x="36" y="24" width="528" height="327" rx="16" fill="#FFFFFF" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1"/>
      
      {/* Large 3D Gradient Sphere */}
      <circle cx="390" cy="187" r="110" fill="url(#social1Grad)" />
      <circle cx="390" cy="187" r="110" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2"/>
      
      <defs>
        <radialGradient id="social1Grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#C084FC"/>
          <stop offset="45%" stopColor="#6366F1"/>
          <stop offset="100%" stopColor="#312E81"/>
        </radialGradient>
      </defs>

      <g transform="translate(70, 75)">
        <rect x="0" y="0" width="130" height="24" rx="12" fill="#4F46E5" fillOpacity="0.08"/>
        <text x="65" y="16" textAnchor="middle" fill="#4F46E5" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em">
          CAMPAIGN LAUNCH
        </text>

        <text x="0" y="65" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-0.02em">
          MOOD INDIGO '25
        </text>
        <text x="0" y="96" fill="#F97316" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700">
          THEME REVEAL MOTION
        </text>

        <text x="0" y="130" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="11" lineHeight="1.5">
          Digital social teaser launch reaching 150k+ organic views across Instagram.
        </text>

        <rect x="0" y="170" width="120" height="34" rx="8" fill="#4F46E5"/>
        <text x="60" y="192" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700">
          WATCH TEASER
        </text>
      </g>
    </svg>
  ),
  'social-2': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#FFF7ED' }}>
      <rect width="100%" height="100%" fill="#FFF7ED"/>
      <rect x="36" y="24" width="528" height="327" rx="16" fill="#FFFFFF" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="1"/>

      <g transform="translate(70, 70)">
        <text x="0" y="24" fill="#F97316" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.1em">E-CELL IIT BOMBAY PRESENTS</text>
        <text x="0" y="60" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="28" fontWeight="800">
          E-SUMMIT SPEAKER LINEUP
        </text>
        <text x="0" y="85" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600">
          Keynote Announcements & Founder Firesides
        </text>

        <g transform="translate(0, 115)">
          <rect x="0" y="0" width="125" height="100" rx="10" fill="#F8FAFC" stroke="rgba(15,23,42,0.06)"/>
          <circle cx="62" cy="40" r="22" fill="#E2E8F0"/>
          <text x="62" y="78" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">UNICORN FOUNDER</text>
          
          <rect x="145" y="0" width="125" height="100" rx="10" fill="#F8FAFC" stroke="rgba(15,23,42,0.06)"/>
          <circle cx="207" cy="40" r="22" fill="#E2E8F0"/>
          <text x="207" y="78" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">GLOBAL VC PARTNER</text>

          <rect x="290" y="0" width="125" height="100" rx="10" fill="#F8FAFC" stroke="rgba(15,23,42,0.06)"/>
          <circle cx="352" cy="40" r="22" fill="#E2E8F0"/>
          <text x="352" y="78" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">TECH VISIONARY</text>
        </g>
      </g>
    </svg>
  ),
  'social-3': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F0FDF4' }}>
      <rect width="100%" height="100%" fill="#F0FDF4"/>
      <rect x="36" y="24" width="528" height="327" rx="16" fill="#FFFFFF" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1"/>

      {/* Dynamic diagonal athletic track stripes */}
      <path d="M 320 24 L 230 351 L 280 351 L 370 24 Z" fill="#10B981" fillOpacity="0.1"/>
      <path d="M 390 24 L 300 351 L 340 351 L 430 24 Z" fill="#10B981" fillOpacity="0.15"/>
      <path d="M 450 24 L 360 351 L 400 351 L 490 24 Z" fill="#4F46E5" fillOpacity="0.1"/>

      <g transform="translate(70, 90)">
        <text x="0" y="20" fill="#10B981" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.1em">INTER-IIT SPORTS MEET</text>
        <text x="0" y="60" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="32" fontWeight="800">
          ATHLETICS CAMPAIGN
        </text>
        <text x="0" y="88" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500">
          IIT Bombay Sports Contingent Visuals & Uniform Badges
        </text>
        
        <rect x="0" y="125" width="140" height="36" rx="8" fill="#0F172A"/>
        <text x="70" y="148" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700">
          ROSTER & GRAPHICS
        </text>
      </g>
    </svg>
  ),
  'video-1': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>
      
      {/* Video Player Viewport */}
      <rect x="36" y="24" width="528" height="327" rx="16" fill="#0F172A"/>
      
      {/* Video Content Backdrop (Rocket Launch Horizon) */}
      <circle cx="300" cy="180" r="140" fill="radial-gradient(circle, #312E81 0%, #0F172A 70%)" opacity="0.6"/>
      <line x1="300" y1="260" x2="300" y2="80" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="300" cy="75" r="5" fill="#F97316"/>
      <path d="M 290 260 L 300 240 L 310 260 Z" fill="#F59E0B"/>

      {/* Central Play Button */}
      <circle cx="300" cy="170" r="32" fill="#FFFFFF" fillOpacity="0.95" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))"/>
      <path d="M 294 157 L 312 170 L 294 183 Z" fill="#4F46E5"/>

      {/* Player Controls Bar */}
      <rect x="56" y="285" width="488" height="46" rx="10" fill="#1E293B" fillOpacity="0.85"/>
      <line x1="72" y1="300" x2="528" y2="300" stroke="#334155" strokeWidth="3" strokeLinecap="round"/>
      <line x1="72" y1="300" x2="260" y2="300" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="260" cy="300" r="5" fill="#FFFFFF"/>
      
      <text x="72" y="322" fill="#FFFFFF" fontFamily="Space Grotesk, monospace" fontSize="10" fontWeight="600">03:24 / 06:12</text>
      <text x="500" y="322" fill="#94A3B8" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">4K 60FPS</text>
      
      {/* Title Header */}
      <text x="60" y="60" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="14" fontWeight="700">
        IIT BOMBAY ROCKET TEAM · TEST LAUNCH VLOG
      </text>
    </svg>
  ),
  'video-2': (
    <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0F172A' }}>
      <rect width="100%" height="100%" fill="#0F172A"/>
      {/* Cinematic Letterbox Aspect */}
      <rect x="0" y="45" width="600" height="285" fill="#1E293B"/>
      
      <circle cx="300" cy="187" r="36" fill="#FFFFFF" fillOpacity="0.9"/>
      <path d="M 294 174 L 312 187 L 294 200 Z" fill="#F97316"/>

      <text x="300" y="260" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700">
        CAMPUS LIFE MINI-DOC: IIT BOMBAY
      </text>
      <text x="300" y="280" textAnchor="middle" fill="#94A3B8" fontFamily="Inter, sans-serif" fontSize="11">
        Cinematic Vignettes · Premiere Pro & DaVinci Resolve
      </text>
    </svg>
  ),
  'reels-1': (
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#FAF5FF' }}>
      <rect width="100%" height="100%" fill="#FAF5FF"/>
      {/* Mobile Smartphone Frame */}
      <rect x="75" y="25" width="250" height="350" rx="24" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.12)" strokeWidth="2"/>
      
      {/* Inner Screen */}
      <rect x="85" y="45" width="230" height="310" rx="16" fill="#4F46E5"/>
      <circle cx="200" cy="190" r="30" fill="#FFFFFF" fillOpacity="0.9"/>
      <path d="M 195 178 L 210 190 L 195 202 Z" fill="#4F46E5"/>

      <text x="105" y="300" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="800">MOOD INDIGO</text>
      <text x="105" y="320" fill="#E0E7FF" fontFamily="Inter, sans-serif" fontSize="10">Aftermovie Promo</text>
      <rect x="105" y="332" width="65" height="14" rx="7" fill="#F97316"/>
      <text x="137" y="342" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">150K VIEWS</text>
    </svg>
  ),
  'reels-2': (
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#FFF7ED' }}>
      <rect width="100%" height="100%" fill="#FFF7ED"/>
      <rect x="75" y="25" width="250" height="350" rx="24" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.12)" strokeWidth="2"/>
      <rect x="85" y="45" width="230" height="310" rx="16" fill="#F97316"/>
      
      {/* Kinetic Typography */}
      <text x="105" y="140" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="800">INNOVATE</text>
      <text x="105" y="180" fill="#FFE4E6" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="800">EXECUTE</text>
      <text x="105" y="220" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="800">TRANSCEND</text>
      
      <circle cx="200" cy="270" r="22" fill="#FFFFFF"/>
      <path d="M 196 261 L 208 270 L 196 279 Z" fill="#F97316"/>
    </svg>
  ),
  'reels-3': (
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F0FDF4' }}>
      <rect width="100%" height="100%" fill="#F0FDF4"/>
      <rect x="75" y="25" width="250" height="350" rx="24" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.12)" strokeWidth="2"/>
      <rect x="85" y="45" width="230" height="310" rx="16" fill="#0F172A"/>

      {/* Podcast Waveform */}
      <g transform="translate(110, 180)">
        <line x1="0" y1="20" x2="0" y2="40" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="15" y2="50" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <line x1="30" y1="0" x2="30" y2="60" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <line x1="45" y1="15" x2="45" y2="45" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <line x1="60" y1="5" x2="60" y2="55" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <line x1="75" y1="20" x2="75" y2="40" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      </g>
      <text x="200" y="280" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700">FOUNDER TALK</text>
      <text x="200" y="300" textAnchor="middle" fill="#94A3B8" fontFamily="Inter, sans-serif" fontSize="10">Snippet Preview</text>
    </svg>
  ),
  'avatar': (
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
      <rect width="100%" height="100%" fill="#F8FAFC"/>
      
      {/* Architectural Frame Grid */}
      <defs>
        <pattern id="avatar-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.8" fill="rgba(15, 23, 42, 0.08)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#avatar-grid)" />
      
      {/* Background Aura */}
      <circle cx="200" cy="200" r="130" fill="radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(249, 115, 22, 0.08) 50%, transparent 70%)" />
      <circle cx="200" cy="200" r="110" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" strokeDasharray="4 4"/>
      
      {/* Stylized Avatar Illustration */}
      <circle cx="200" cy="165" r="54" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3"/>
      {/* Modern Round Glasses */}
      <circle cx="182" cy="162" r="14" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2.5"/>
      <circle cx="218" cy="162" r="14" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2.5"/>
      <line x1="196" y1="162" x2="204" y2="162" stroke="#4F46E5" strokeWidth="2.5"/>
      <path d="M 188 190 Q 200 198 212 190" stroke="#0F172A" strokeWidth="2" strokeLinecap="round"/>

      {/* Shoulders & Jacket */}
      <path d="M 125 285 C 135 235 160 220 200 220 C 240 220 265 235 275 285 Z" fill="#0F172A"/>
      {/* IIT Bombay Pin */}
      <circle cx="160" cy="245" r="5" fill="#F97316"/>

      {/* Identity Pill */}
      <rect x="110" y="325" width="180" height="28" rx="14" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.1)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.04))"/>
      <text x="200" y="343" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="10" fontWeight="700">
        SHREYANSH SINGH · IITB '27
      </text>
    </svg>
  )
};

// Normalized category vector illustration fallbacks
const categoryVectorFallbacks = {
  'ui': placeholderSvgs['ui-2'],
  'ui/ux': placeholderSvgs['ui-2'],
  'ui/ux design': placeholderSvgs['ui-2'],
  'brand': placeholderSvgs['branding-1'],
  'branding': placeholderSvgs['branding-1'],
  'brand identity': placeholderSvgs['branding-1'],
  'brand & identity': placeholderSvgs['branding-1'],
  'print': placeholderSvgs['print-1'],
  'print & layout': placeholderSvgs['print-1'],
  'print media': placeholderSvgs['print-1'],
  'motion': placeholderSvgs['video-1'],
  'video': placeholderSvgs['video-1'],
  'motion & video': placeholderSvgs['video-1'],
  'social': placeholderSvgs['social-1'],
  'social media': placeholderSvgs['social-1'],
  'social content': placeholderSvgs['social-1']
};

const defaultVectorFallback = (
  <svg width="100%" height="100%" viewBox="0 0 600 375" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#F8FAFC' }}>
    <rect width="100%" height="100%" fill="#F8FAFC"/>
    <rect x="24" y="24" width="552" height="327" rx="16" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1"/>
    <circle cx="300" cy="187" r="60" fill="rgba(79, 70, 229, 0.08)" stroke="#4F46E5" strokeWidth="1.5"/>
    <path d="M 270 215 L 300 150 L 330 215" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="300" y="270" textAnchor="middle" fill="#0F172A" fontFamily="Space Grotesk, sans-serif" fontSize="12" fontWeight="700">
      CREATIVE SYSTEM
    </text>
  </svg>
);

export const ProjectImage = ({
  src,
  alt = 'Project Image',
  category = 'UI/UX Design',
  aspectClass = 'aspect-video',
  className = '',
  style = {}
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const normalizedCategory = (category || '').toLowerCase().trim();
  const isSvgScheme = typeof src === 'string' && src.startsWith('svg:');
  const svgKey = isSvgScheme ? src.split(':')[1] : '';

  const renderFallback = () => {
    if (svgKey && placeholderSvgs[svgKey]) {
      return placeholderSvgs[svgKey];
    }
    if (categoryVectorFallbacks[normalizedCategory]) {
      return categoryVectorFallbacks[normalizedCategory];
    }
    for (const [key, vector] of Object.entries(categoryVectorFallbacks)) {
      if (normalizedCategory.includes(key)) {
        return vector;
      }
    }
    return defaultVectorFallback;
  };

  const showFallback = !src || isSvgScheme || hasError;

  return (
    <div
      className={`project-image-wrapper relative overflow-hidden bg-slate-50 ${aspectClass} ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        isolation: 'isolate',
        ...style
      }}
    >
      {/* Shimmer loading skeleton */}
      {isLoading && !showFallback && (
        <div
          className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
          }}
        />
      )}

      {showFallback ? (
        renderFallback()
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export default ProjectImage;
