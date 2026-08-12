/**
 * Explicit dark background definitions for GPU-promoted layers
 */
export const GPU_BG_COLOR = '#070B18';

export const gpuBase = {
  style: {
    backgroundColor: '#070B18',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
    willChange: 'transform, opacity',
    contain: 'paint',
    isolation: 'isolate',
  },
};

export const gpuPanel = {
  style: {
    ...gpuBase.style,
    backgroundColor: '#0D1117',
  },
};

export const gpuCard = {
  style: {
    ...gpuBase.style,
    backgroundColor: '#12172a',
    willChange: 'transform',
  },
};

export const applyGpuFix = (extraStyles = {}) => ({
  ...gpuBase.style,
  ...extraStyles
});

export default applyGpuFix;
