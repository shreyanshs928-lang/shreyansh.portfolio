const ease = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const cardStagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease }
  })
};

// CANONICAL viewport config — use this on EVERY whileInView call.
// once: true is non-negotiable. It prevents reverse-scroll re-triggers.
export const viewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -40px 0px'
};

// Backward compatibility alias
export const viewportOnce = viewport;

// Canonical transition
export const transition = {
  duration: 0.55,
  ease
};

export const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease
    }
  }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 160
    }
  }
};

export default {
  fadeUp,
  fadeIn,
  cardStagger,
  viewport,
  viewportOnce,
  transition
};
