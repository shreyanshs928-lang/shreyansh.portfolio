import { gpuBase } from './gpuFix';

/**
 * Utility spread properties for GPU acceleration layer promotion
 * Prevents canvas compositor leaks and eliminates FOUC/background flashes
 */
export const gpuLayer = {
  style: {
    ...gpuBase.style,
    backgroundColor: '#070B18'
  }
};

export default gpuLayer;
