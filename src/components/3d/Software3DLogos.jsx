import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { CursorContext } from '../../context/CursorContext';
import { Sparkles, RotateCcw, ExternalLink, Box, Eye } from 'lucide-react';

// Tool metadata
const TOOLS = [
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    shortName: 'Ps',
    tagline: 'Raster Graphics & Composite Art',
    accentColor: '#31A8FF',
    bgGradient: ['#001E36', '#000D1A'],
    borderHex: 0x31a8ff,
    bgHex: 0x001e36,
    textHex: '#31A8FF',
    experience: '2+ Years',
    useCases: ['Poster Art', 'Photo Grading', 'Texture Blending', 'Asset Compositing']
  },
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    shortName: 'Ai',
    tagline: 'Vector Systems & Brand Identity',
    accentColor: '#FF9A00',
    bgGradient: ['#261300', '#140A00'],
    borderHex: 0xff9a00,
    bgHex: 0x261300,
    textHex: '#FF9A00',
    experience: '2+ Years',
    useCases: ['Logo Systems', 'Iconography', 'Typography Specs', 'Vector Art']
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    shortName: 'Dv',
    tagline: 'Color Grading & Cinematic Motion',
    accentColor: '#FF5722',
    bgGradient: ['#171923', '#0F1016'],
    borderHex: 0xff5722,
    bgHex: 0x14151a,
    textHex: '#FFFFFF',
    experience: '1.5+ Years',
    useCases: ['Color Science', 'Node Grading', 'Festival Aftermovies', 'Audio Mastering']
  }
];

// Helper to generate high-res canvas texture for each tool logo
function createLogoTexture(tool) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, tool.bgGradient[0]);
  gradient.addColorStop(1, tool.bgGradient[1]);
  ctx.fillStyle = gradient;
  ctx.roundRect(16, 16, 480, 480, 48);
  ctx.fill();

  // Subtle interior glow border
  ctx.lineWidth = 14;
  ctx.strokeStyle = tool.accentColor;
  ctx.roundRect(24, 24, 464, 464, 42);
  ctx.stroke();

  // Highlight sheen
  const sheen = ctx.createLinearGradient(0, 0, 512, 256);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
  sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.ellipse(256, 120, 200, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  if (tool.id === 'davinci') {
    // DaVinci Resolve iconic 3-petal color disc
    const cx = 256;
    const cy = 200;
    const radius = 60;

    // Petal 1: Red
    ctx.beginPath();
    ctx.arc(cx - 30, cy + 18, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    // Petal 2: Green
    ctx.beginPath();
    ctx.arc(cx + 30, cy + 18, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    // Petal 3: Blue
    ctx.beginPath();
    ctx.arc(cx, cy - 35, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();

    // Core Blend
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();

    // Text "DaVinci"
    ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RESOLVE', 256, 360);

    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('COLOR & MOTION', 256, 410);
  } else {
    // Photoshop or Illustrator typographic badge
    ctx.font = 'bold 210px "Space Grotesk", sans-serif';
    ctx.fillStyle = tool.textHex;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tool.shortName, 256, 260);

    // Subtle label underneath
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(tool.id.toUpperCase(), 256, 420);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const Software3DLogos = ({ splineSceneUrl = null }) => {
  const mountRef = useRef(null);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('webgl'); // 'webgl' or 'spline'

  const meshesRef = useRef([]);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef(null);

  const activeTool = TOOLS[activeToolIndex];

  // Initialize Three.js scene
  useEffect(() => {
    if (viewMode !== 'webgl' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Clean previous canvases
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4f46e5, 1.5);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2, 20);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // Geometry for 3D Cards / Cubes
    const boxGeometry = new THREE.BoxGeometry(1.65, 1.65, 0.35);

    // Create a 3D mesh for each tool
    const meshes = TOOLS.map((tool, idx) => {
      const faceTexture = createLogoTexture(tool);

      // Side materials (metallic dark edge)
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: tool.bgHex,
        metalness: 0.8,
        roughness: 0.25
      });

      // Front & Back materials
      const frontMaterial = new THREE.MeshStandardMaterial({
        map: faceTexture,
        metalness: 0.2,
        roughness: 0.35
      });

      const materials = [
        sideMaterial, // right
        sideMaterial, // left
        sideMaterial, // top
        sideMaterial, // bottom
        frontMaterial, // front
        sideMaterial  // back
      ];

      const mesh = new THREE.Mesh(boxGeometry, materials);

      // Position in arc
      const spacing = 2.45;
      mesh.position.x = (idx - 1) * spacing;
      mesh.position.y = 0;
      mesh.position.z = 0;

      // Base rotation
      mesh.rotation.x = 0.1;
      mesh.rotation.y = (idx - 1) * -0.25;

      mesh.userData = { toolIndex: idx, initialX: mesh.position.x };
      scene.add(mesh);
      return mesh;
    });

    meshesRef.current = meshes;

    // Raycaster for mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const toolIdx = hitMesh.userData.toolIndex;
        if (toolIdx !== undefined) {
          setActiveToolIndex(toolIdx);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Pointer move interaction (parallax tilt)
    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      pointerPosRef.current = { x: normX, y: normY };

      if (isPointerDownRef.current && meshes[activeToolIndex]) {
        meshes[activeToolIndex].rotation.y += e.movementX * 0.015;
        meshes[activeToolIndex].rotation.x += e.movementY * 0.015;
      }
    };

    const handlePointerDown = () => { isPointerDownRef.current = true; };
    const handlePointerUp = () => { isPointerDownRef.current = false; };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation loop
    let clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      meshes.forEach((mesh, idx) => {
        const isActive = idx === activeToolIndex;

        // Gentle floating
        mesh.position.y = Math.sin(elapsed * 1.5 + idx * 1.2) * 0.12;

        if (isActive) {
          // Highlight active mesh with subtle scale and target orientation
          mesh.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
          if (!isPointerDownRef.current) {
            const targetRotY = pointerPosRef.current.x * 0.6;
            const targetRotX = -pointerPosRef.current.y * 0.4 + 0.08;
            mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotY, 0.06);
            mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, 0.06);
          }
        } else {
          // Inactive meshes keep ambient tilt and standard scale
          mesh.scale.lerp(new THREE.Vector3(0.9, 0.9, 0.9), 0.1);
          const baseOffset = (idx - 1) * -0.3;
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, baseOffset + Math.sin(elapsed + idx) * 0.1, 0.04);
          mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0.08, 0.04);
        }
      });

      // Point light follows cursor slightly
      pointLight.position.x = pointerPosRef.current.x * 3;
      pointLight.position.y = pointerPosRef.current.y * 3 + 1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 340;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      }
      boxGeometry.dispose();
      renderer.dispose();
    };
  }, [viewMode, activeToolIndex]);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white overflow-hidden shadow-2xl p-5 sm:p-6">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
            3D CREATIVE SUITE MATRIX
          </span>
        </div>

        {/* View Switcher / Spline Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700/60 text-[11px] font-mono">
          <button
            onClick={() => setViewMode('webgl')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              viewMode === 'webgl' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box size={12} />
            <span>WebGL 3D</span>
          </button>
          
          <button
            onClick={() => setViewMode('spline')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              viewMode === 'spline' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Spline 3D Scene View"
          >
            <Sparkles size={12} />
            <span>Spline View</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas / Spline Display */}
      <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800/60 flex items-center justify-center">
        {viewMode === 'webgl' ? (
          <>
            <div 
              ref={mountRef} 
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
              title="Click a logo to inspect or drag to rotate in 3D"
            />
            {/* Interactive hint spell */}
            <div className="absolute bottom-2.5 left-3 pointer-events-none text-[10px] font-mono text-slate-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              Drag to rotate · Click logo to inspect
            </div>
          </>
        ) : (
          /* Spline 3D Integration View */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {splineSceneUrl ? (
              <iframe
                src={splineSceneUrl}
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full rounded-lg"
                title="Spline 3D Experience"
              />
            ) : (
              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto text-indigo-400">
                  <Sparkles size={24} />
                </div>
                <h4 className="font-heading text-sm font-bold text-white">
                  Spline 3D Scene Integration
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export your 3D scene from Spline.design and connect your <code className="text-indigo-300">scene.splinecode</code> URL in the admin console to stream real-time Spline physics.
                </p>
                <button
                  onClick={() => setViewMode('webgl')}
                  className="btn btn-primary text-xs py-2 px-4 rounded-full mx-auto"
                >
                  Return to WebGL 3D
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tool Selector Tabs & Metadata Card */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        {/* Tool Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          {TOOLS.map((tool, idx) => {
            const isSelected = idx === activeToolIndex;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveToolIndex(idx)}
                className={`py-2 px-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-800/90 border-slate-600 shadow-md ring-1 ring-white/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover(tool.shortName);
                }}
                onMouseLeave={triggerDefault}
              >
                <div 
                  className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ backgroundColor: tool.accentColor, color: '#000000' }}
                >
                  {tool.shortName}
                </div>
                <div className="overflow-hidden">
                  <span className="block text-xs font-bold text-white truncate">
                    {tool.name.replace('Adobe ', '')}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {tool.experience}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tool Details Card */}
        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white">
                {activeTool.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {activeTool.tagline}
              </span>
            </div>
            {/* Tool tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeTool.useCases.map((useCase, i) => (
                <span 
                  key={i} 
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Proficiency: <strong className="text-emerald-400">Advanced</strong>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Software3DLogos;