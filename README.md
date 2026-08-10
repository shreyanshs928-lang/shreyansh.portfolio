# Shreyansh Singh · Multidisciplinary Designer Portfolio

A high-performance, dark-themed React 18 web application showcasing multidisciplinary design, UI/UX, motion, print, and brand systems. Built with React 18, Vite, Tailwind CSS v3, Framer Motion v10+, and integrated with Firebase Cloud Firestore for real-time portfolio management.

---

## 🚀 Key Features

- **3D Parallax Ambient Lighting & Hero Section**: Dynamic spotlight tracking, interactive floating wireframe geometries, animated count-up statistics, and static tag clouds.
- **3D Interactive Card Flipping (`WorkCard3D`)**: Hardware-accelerated 3D tilt and rapid 180ms card flip animations with front-facing media thumbnails and back-face detailed project specifications.
- **Jitter-Free Selected Works Carousel (`Carousel`)**: Bounded drag track powered by Framer Motion, featuring low-elasticity momentum, dynamic `ResizeObserver` bounds, and touch overscroll containment.
- **Unified Image Loading & Shimmer System (`ProjectImage`)**: Zero-layout-shift image wrapper with locked aspect ratios, gradient shimmer skeletons during load, and category-aware SVG vector fallbacks on error.
- **Full Admin CMS & Dashboard (`/admin`)**: Firebase Auth-protected CMS featuring live content editing, `@dnd-kit` drag-and-drop project reordering, and direct Firestore database sync.
- **Custom Interactive Cursor System**: 3-state custom cursor (Default dot+ring, Hover pill, Directional 3D tilt target) powered by React Context (`CursorContext`).
- **Resilient Fallback Data Layer**: `formatFallbackData()` handler in Firestore integration ensuring 100% full portfolio functionality even if database permissions are restricted or offline.

---

## 📁 Project Structure

```
shreyansh-portfolio-react/
├── public/
│   └── index.html            # Pre-hydration HTML with inline canvas locks (#070B18)
├── src/
│   ├── admin/                # CMS & Admin Portal
│   │   ├── components/       # ImageUploader, ProjectModal, SectionEditor, SortableItem
│   │   └── pages/            # Dashboard.jsx, Login.jsx
│   ├── components/           # Core Shared UI Components
│   │   ├── ui/               # Reusable UI primitives
│   │   │   ├── Carousel.jsx  # Framer Motion drag container with bounds detection
│   │   │   └── ProjectImage.jsx # Aspect-ratio locked image + shimmer skeleton + fallback
│   │   ├── AnimatedSection.jsx
│   │   ├── Cursor.jsx        # Custom cursor overlay
│   │   └── Layout.jsx        # Root dark background wrapper with isolation: isolate
│   ├── context/              # React Context Providers
│   │   ├── AuthContext.jsx   # Firebase Authentication provider
│   │   ├── CursorContext.jsx # Global cursor state management
│   │   └── MousePositionContext.jsx # Mouse position tracker
│   ├── firebase/             # Database & Storage Services
│   │   ├── config.js         # Firebase App initialization
│   │   └── firestore.js      # CRUD mutators, autoseed logic, and graceful fallback payload
│   ├── hooks/                # Custom React Hooks
│   │   ├── useCursor.js      # Directional hover hooks
│   │   └── useFadeInOnScroll.js # IntersectionObserver scroll reveal with once: true
│   ├── portfolio/            # Main Portfolio View Components
│   │   └── components/
│   │       ├── About.jsx     # Biography and stat pills
│   │       ├── Background.jsx# Academic background and design creed
│   │       ├── Experience.jsx# Work timeline section
│   │       ├── FeaturedWorksTable.jsx # Tabular featured works
│   │       ├── Footer.jsx    # Footer CTA & contact links
│   │       ├── Header.jsx    # Fixed/Floating Navigation bar (zIndex: 9999)
│   │       ├── Hero.jsx      # Hero banner, 3D ambient lighting, and stat cards
│   │       ├── Skills.jsx    # Technical & design tool pills
│   │       ├── WorkCard3D.jsx# 3D interactive flipping work card
│   │       ├── WorkCarousel.jsx # Selected Works carousel section
│   │       └── WorkSection.jsx  # Categorized project grids (UI, Print, Motion, Social, etc.)
│   ├── styles/               # CSS Design System
│   │   ├── animations.css    # Keyframes for floating shapes and count-up cards
│   │   └── index.css         # Reverse-scroll flash prevention, Tailwind imports, glassmorphism tokens
│   ├── utils/                # Utility Modules
│   │   ├── gpuFix.js         # Explicit dark background definitions for GPU-promoted layers
│   │   ├── motionProps.js    # GPU acceleration style spread utility
│   │   └── scrollAnimations.js # Canonical Framer Motion variants & once: true viewport config
│   ├── App.jsx               # Root App component, router setup, and ErrorBoundary
│   └── main.jsx              # React DOM entrypoint wrapped in <Layout>
├── package.json
├── tailwind.config.js        # Theme color extensions (--bg-base, --bg-elevated)
├── vite.config.js            # Vite configuration (port 3000, host 0.0.0.0)
└── README.md
```

---

## ⚡ Recent Performance & Visual Fixes

1. **Reverse-Scroll Flash & FOUC Elimination**:
   - Added pre-JS inline body background style (`#070B18`) in `index.html` and `#070B18 !important` rules at top of `index.css`.
   - Applied explicit dark backgrounds on all GPU-promoted layers (`gpuFix.js`) to eliminate white canvas compositor leaks.
   - Locked root container with `isolation: isolate` and `min-height: 100dvh` in `Layout.jsx`.
2. **Scroll Animation Re-Entry Fix**:
   - Enforced `viewport: { once: true }` across scroll triggers (`scrollAnimations.js`) and unobserved IntersectionObservers (`useFadeInOnScroll.js` & `AnimatedStatCard`) to prevent reverse-scroll reset glitches.
3. **Card Image Aspect Ratio & Shimmer**:
   - Created `ProjectImage.jsx` to lock aspect ratios (`aspect-video`), preventing layout shift during image loading and displaying `@keyframes shimmer` skeletons.
4. **Jitter-Free Drag Carousel**:
   - Created `Carousel.jsx` with Framer Motion drag constraints, low elasticity (`0.08`), fixed card width (`flex-shrink-0 w-[300px] md:w-[350px]`), and touch overscroll containment.

---

## 🛡️ Key Development Constraints

- **GPU Compositing Layers**: Every element that uses `will-change: transform` or `transform: translateZ(0)` MUST specify an explicit dark background color (e.g. `backgroundColor: "#070B18"` or `gpuLayer`). Inherited parent backgrounds do not follow elements onto GPU layers.
- **Viewport Scroll Triggers**: All `whileInView` or IntersectionObserver hooks MUST use `once: true` / unobserve on entry to prevent reverse-scroll animation resets.
- **Explicit Height Locking**: Animated section containers must use explicit `minHeight` / `aspectRatio` rules. Never animate an element whose height is `auto`.
- **Strict Hook Ordering**: In React components (e.g., `App.jsx`), all React hooks (`useRef`, `useState`, `useEffect`) MUST be declared **before** any early returns or conditional error state checks.

---

## ⚙️ Getting Started & Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/shreyanshs928-lang/shreyansh.portfolio.git
cd shreyansh-portfolio-react
npm install
```

### Environment Variables
Create a `.env.local` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Local Dev Server
```bash
npm run dev
```
The site will be accessible at `http://localhost:3000/`.

### Production Build
```bash
npm run build
```

---

## 📄 License
Private Repository · All Rights Reserved © Shreyansh Singh.
