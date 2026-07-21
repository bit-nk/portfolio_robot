// Single source for the OS "reduce motion" preference. Read at call time so a
// change takes effect on the next mount/frame check (full live-toggle needs a reload).
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
