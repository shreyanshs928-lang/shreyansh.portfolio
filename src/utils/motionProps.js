/**
 * Utility spread properties for GPU acceleration layer promotion
 * Prevents canvas compositor leaks and eliminates FOUC/background flashes
 */
export const gpuLayer = {
  style: {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    isolation: 'isolate',
    backgroundColor: '#070B18'
  }
};

export default gpuLayer;
