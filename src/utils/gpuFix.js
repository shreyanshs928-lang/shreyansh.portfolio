/**
 * Explicit dark background definitions for GPU-promoted layers
 */
export const GPU_BG_COLOR = '#070B18';

export const applyGpuFix = (extraStyles = {}) => ({
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  isolation: 'isolate',
  backgroundColor: GPU_BG_COLOR,
  ...extraStyles
});

export default applyGpuFix;
