import { db } from './config';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Default mock portfolio data used for database seeding
export const defaultPortfolioData = {
  passcode: 'admin',
  profile: {
    eyebrowText: "Hey, I'm Shreyansh",
    headlineLine1: "Multidisciplinary Designer +",
    headlineLine2: "Chemical Engineer",
    bioText: "I design across UI/UX, motion, print and social — blending an engineer's precision with a designer's instinct. Currently building creative systems at IIT Bombay.",
    resumeLink: "https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      behance: "https://behance.net",
      email: "shreyansh@example.com"
    },
    portraitImage: "svg:profile-placeholder",
    badgeText: "Self-Taught Designer",
    stats: [
      { value: '2+', label: 'Years Designing' },
      { value: '10+', label: 'Projects Shipped' },
      { value: '6', label: 'Disciplines' },
      { value: "IIT Bombay '27", label: 'Student Core' }
    ]
  },
  disciplines: [
    'Creative Direction',
    'Brand Systems',
    'Editorial Design',
    'UI/UX Layouts',
    'Motion & Kinetic Video'
  ],
  about: {
    paragraph: 'I am a self-taught multidisciplinary designer currently studying Chemical Engineering at <strong>IIT Bombay</strong>. My design process is defined by high contrast grids, modern typographic rhythm, and clean execution. From branding campaigns for college festivals to telemetry dashboards for rockets, I design functional art.<br><br>I specialize in translating complex systems into clean interfaces and visual guides. For the last 2 years, I have built design architectures for festival teams, student groups, and independent clients.',
    profilePhoto: 'svg:profile-placeholder',
    stats: [
      '5+ Years Design Experience',
      '50+ Shipped Creative Projects',
      '150k+ Festival Video Views'
    ]
  },
  work: {
    social: [
      { id: 'proj-social-1', title: "Mood Indigo '25 Reveal", tag: "Instagram Post", image: "svg:social-1", status: "published", orderIndex: 0 },
      { id: 'proj-social-2', title: "E-Summit Speaker Lineup", tag: "Instagram Carousel", image: "svg:social-2", status: "published", orderIndex: 1 },
      { id: 'proj-social-3', title: "Inter-IIT Sports Campaign", tag: "Facebook Graphics", image: "svg:social-3", status: "published", orderIndex: 2 }
    ],
    print: [
      { id: 'proj-print-1', title: "Aether Propulsion Journal", tag: "Editorial Booklet", image: "svg:print-1", status: "published", orderIndex: 0 },
      { id: 'proj-print-2', title: "Mood Indigo Festival Guide", tag: "Printed Zine", image: "svg:print-2", status: "published", orderIndex: 1 }
    ],
    ui: [
      { id: 'proj-ui-1', title: "E-Cell Incubator Portal", tag: "UI/UX Dashboard", caseStudyUrl: "https://behance.net", image: "svg:ui-1", status: "published", orderIndex: 0 },
      { id: 'proj-ui-2', title: "IITB Rocket Telemetry", tag: "Flight Control UI", caseStudyUrl: "https://behance.net", image: "svg:ui-2", status: "published", orderIndex: 1 }
    ],
    reels: [
      { id: 'proj-reels-1', title: "Mood Indigo Aftermovie Promo", tag: "Instagram Reel", image: "svg:reels-1", status: "published", orderIndex: 0 },
      { id: 'proj-reels-2', title: "E-Summit Keynote Kinetic Typo", tag: "YouTube Shorts", image: "svg:reels-2", status: "published", orderIndex: 1 },
      { id: 'proj-reels-3', title: "Founder's Talk Sneak Peek", tag: "Instagram Reel", image: "svg:reels-3", status: "published", orderIndex: 2 }
    ],
    video: [
      { id: 'proj-video-1', title: "IITB Rocket Team Test Launch Vlog", tag: "Documentary Edit", tools: ["Premiere Pro", "After Effects"], image: "svg:video-1", status: "published", orderIndex: 0 },
      { id: 'proj-video-2', title: "Campus Life Mini-Doc: IIT Bombay", tag: "Cinematic Vlog", tools: ["Premiere Pro", "DaVinci Resolve"], image: "svg:video-2", status: "published", orderIndex: 1 }
    ],
    branding: [
      {
        id: 'proj-branding-1',
        title: "Alumination Identity System",
        tag: "Brand System",
        desc: "A complete design system restructuring Alumination (the student-alumni relations cell of IIT Bombay). Standardized construction grids for the primary logo, developed customized typography specs, and created physical mockups for apparel.",
        scope: "Logo, Guides & Merch",
        org: "IIT Bombay",
        image: "svg:branding-1",
        status: "published",
        orderIndex: 0
      }
    ]
  },
  experience: [
    {
      role: "Creative Lead",
      company: "Alumination, IIT Bombay",
      duration: "Jun 2025 – Present",
      points: [
        "Leading a team of 8 design coordinators to construct Alumination's brand systems.",
        "Designing the annual printed newsletter and editorial booklets delivered to over 40,000 global IIT Bombay alumni."
      ]
    },
    {
      role: "Design Lead",
      company: "E-Cell IIT Bombay",
      duration: "Apr 2025 – Present",
      points: [
        "Spearheading digital assets, interface layouts, and UI components for the E-Summit website.",
        "Designing targeted social media campaigns that drove E-Summit registration engagement metrics up by 40%."
      ]
    },
    {
      role: "Design & Business Lead",
      company: "IIT Bombay Rocket Team",
      duration: "Oct 2024 – Present",
      points: [
        "Designing the telemetry visual dashboards, vector blueprints, and rocket schemas for international competition folders.",
        "Building the brand look and custom merchandise (hoodies, badges, banners) representing the college rocket team."
      ]
    },
    {
      role: "Creative Executive",
      company: "Mood Indigo, IIT Bombay",
      duration: "Jul 2024 – Jan 2025",
      points: [
        "Collaborated in designing print zines and booklets for Asia's largest college cultural festival.",
        "Directed and edited 10+ high-engagement festival teaser videos and short Reels, accumulating 150k+ organic views."
      ]
    },
    {
      role: "Independent Multidisciplinary Designer",
      company: "Freelance",
      duration: "Jan 2024 – Present",
      points: [
        "Crafting visual brand guides and clean website interfaces for early-stage student startups and independent clients.",
        "Translating technical systems into highly readable, beautiful vector graphics and interface screens."
      ]
    }
  ],
  skills: {
    tools: ["Figma", "Adobe Premiere", "CapCut", "Adobe Illustrator", "Canva", "DaVinci Resolve", "After Effects"],
    other: ["Brand Identity", "Social Media Strategy", "Motion Design", "Print Layout", "UI/UX Design", "Content Direction", "Editorial Systems", "Chemical Engineering"]
  },
  background: {
    degree: "B.Tech Chemical Engineering",
    institution: "IIT Bombay",
    year: "Graduating 2027",
    philosophy: "All design skills self-taught — built through real projects, not courses. I believe in learning by breaking things, shipping actual work, and designing at the intersection of engineering systems and creative aesthetics.",
    achievements: [
      "Winner, Mood Indigo Annual Design Hackathon (2025)",
      "Best Branding Runner-up, IITB Tech Fest Design Challenge (2024)"
    ]
  },
  footer: {
    tagline: 'Designing visual brands, editorial systems, and digital interfaces.',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
    behanceUrl: 'https://behance.net',
    email: 'shreyansh@example.com',
    copyright: '© 2026 Shreyansh Singh · Made with intention'
  }
};

// --- DATA SEEDING HELPER ---
export const seedDefaultData = async () => {
  const batch = writeBatch(db);

  // 1. Hero
  const heroRef = doc(db, 'portfolio', 'hero');
  batch.set(heroRef, {
    eyebrowText: defaultPortfolioData.profile.eyebrowText,
    headlineLine1: defaultPortfolioData.profile.headlineLine1,
    headlineLine2: defaultPortfolioData.profile.headlineLine2,
    bioText: defaultPortfolioData.profile.bioText,
    resumeLink: defaultPortfolioData.profile.resumeLink,
    socialLinks: defaultPortfolioData.profile.socialLinks,
    portraitImage: defaultPortfolioData.profile.portraitImage,
    badgeText: defaultPortfolioData.profile.badgeText,
    ticker: defaultPortfolioData.disciplines,
    stats: defaultPortfolioData.profile.stats,
    lastEdited: serverTimestamp()
  });

  // 2. About
  const aboutRef = doc(db, 'portfolio', 'about');
  batch.set(aboutRef, {
    paragraph: defaultPortfolioData.about.paragraph,
    profilePhoto: defaultPortfolioData.about.profilePhoto,
    stats: defaultPortfolioData.about.stats,
    lastEdited: serverTimestamp()
  });

  // 3. Experience
  const expRef = doc(db, 'portfolio', 'experience');
  batch.set(expRef, {
    entries: defaultPortfolioData.experience,
    lastEdited: serverTimestamp()
  });

  // 4. Skills
  const skillsRef = doc(db, 'portfolio', 'skills');
  batch.set(skillsRef, {
    tools: defaultPortfolioData.skills.tools,
    other: defaultPortfolioData.skills.other,
    lastEdited: serverTimestamp()
  });

  // 5. Background
  const bgRef = doc(db, 'portfolio', 'background');
  batch.set(bgRef, {
    degree: defaultPortfolioData.background.degree,
    institution: defaultPortfolioData.background.institution,
    year: defaultPortfolioData.background.year,
    philosophy: defaultPortfolioData.background.philosophy,
    achievements: defaultPortfolioData.background.achievements,
    lastEdited: serverTimestamp()
  });

  // 6. Footer
  const footerRef = doc(db, 'portfolio', 'footer');
  batch.set(footerRef, {
    tagline: defaultPortfolioData.footer.tagline,
    linkedinUrl: defaultPortfolioData.footer.linkedinUrl,
    instagramUrl: defaultPortfolioData.footer.instagramUrl,
    behanceUrl: defaultPortfolioData.footer.behanceUrl,
    email: defaultPortfolioData.footer.email,
    copyright: defaultPortfolioData.footer.copyright,
    lastEdited: serverTimestamp()
  });

  await batch.commit();

  // 7. Work subcollections (run sequentially to avoid overloading)
  for (const [category, projects] of Object.entries(defaultPortfolioData.work)) {
    for (const project of projects) {
      const projRef = doc(db, 'portfolio', 'work', category, project.id);
      await setDoc(projRef, {
        ...project,
        lastEdited: serverTimestamp()
      });
    }
  }

  console.log('Database seeded successfully!');
};

// Helper to wrap promises with a timeout
const withTimeout = (promise, ms = 6000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timed out. Please check your Firebase configuration and database rules.")), ms)
    )
  ]);
};

// --- DATA ACCESS LAYER ---

// Fetch full portfolio payload
export const fetchPortfolioData = async () => {
  // Check for missing/dummy environment variables to fail fast
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId || projectId === "dummy-project-id") {
    throw new Error("Firebase Environment Variables are not configured. Please add your VITE_FIREBASE_* environment variables in your Vercel project settings.");
  }

  // Check if hero exists first with a timeout to prevent hanging
  const heroSnap = await withTimeout(getDoc(doc(db, 'portfolio', 'hero')), 6000);
  
  if (!heroSnap.exists()) {
    console.log('No database found. Autoseeding initial portfolio content...');
    await seedDefaultData();
    // Re-fetch hero after seeding
    return fetchPortfolioData();
  }

  const [aboutSnap, expSnap, skillsSnap, bgSnap, footerSnap] = await Promise.all([
    getDoc(doc(db, 'portfolio', 'about')),
    getDoc(doc(db, 'portfolio', 'experience')),
    getDoc(doc(db, 'portfolio', 'skills')),
    getDoc(doc(db, 'portfolio', 'background')),
    getDoc(doc(db, 'portfolio', 'footer'))
  ]);

  // Fetch all 6 work subcollections
  const categories = ['social', 'print', 'ui', 'reels', 'video', 'branding'];
  const workData = {};

  await Promise.all(
    categories.map(async (cat) => {
      const q = query(collection(db, 'portfolio', 'work', cat), orderBy('orderIndex', 'asc'));
      const querySnap = await getDocs(q);
      const list = [];
      querySnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      workData[cat] = list;
    })
  );

  return {
    hero: heroSnap.data(),
    about: aboutSnap.data(),
    experience: expSnap.data()?.entries || [],
    skills: skillsSnap.data(),
    background: bgSnap.data(),
    footer: footerSnap.data(),
    work: workData
  };
};

// --- ADMIN MUTATION MUTATORS ---

export const saveHero = async (data) => {
  const ref = doc(db, 'portfolio', 'hero');
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  });
};

export const saveAbout = async (data) => {
  const ref = doc(db, 'portfolio', 'about');
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  });
};

export const saveExperience = async (entries) => {
  const ref = doc(db, 'portfolio', 'experience');
  await setDoc(ref, {
    entries,
    lastEdited: serverTimestamp()
  });
};

export const saveSkills = async (data) => {
  const ref = doc(db, 'portfolio', 'skills');
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  });
};

export const saveBackground = async (data) => {
  const ref = doc(db, 'portfolio', 'background');
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  });
};

export const saveFooter = async (data) => {
  const ref = doc(db, 'portfolio', 'footer');
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  });
};

export const saveWorkProject = async (category, projectId, data) => {
  const ref = doc(db, 'portfolio', 'work', category, projectId);
  await setDoc(ref, {
    ...data,
    lastEdited: serverTimestamp()
  }, { merge: true });
};

export const deleteWorkProject = async (category, projectId) => {
  const ref = doc(db, 'portfolio', 'work', category, projectId);
  await deleteDoc(ref);
};

export const saveWorkProjectOrder = async (category, projects) => {
  const batch = writeBatch(db);
  projects.forEach((proj, index) => {
    const ref = doc(db, 'portfolio', 'work', category, proj.id);
    batch.update(ref, {
      orderIndex: index,
      lastEdited: serverTimestamp()
    });
  });
  await batch.commit();
};
