import { applyGrain } from '../utils/grained';
import { useEffect } from 'react';

/**
 * Hook to apply grained.js effect to an element
 * @param {string} elementId 
 * @param {object} options 
 */
export const useGrained = (elementId, options = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const baseOptions = {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 0.9,
      grainHeight: 0.9,
      grainChaos: 0.5,
      grainSpeed: 10,
      bubbles: true
    };

    const isHighRes = window.innerWidth >= 1440;
    const defaultOptions = isHighRes
      ? {
          ...baseOptions,
          patternWidth: 80,
          patternHeight: 80,
          grainDensity: 1.4,
          grainOpacity: 0.11
        }
      : baseOptions;

    const finalOptions = { ...defaultOptions, ...options };

    let cleanup = () => {};

    const apply = () => {
      const el = document.getElementById(elementId);
      if (!el) return;

      // Check if overlay already exists - don't re-apply
      const existingOverlay = el.querySelector('[data-grained-overlay-id]');
      if (existingOverlay) {
        return;
      }
      
      cleanup = applyGrain(el, finalOptions);
    };

    // Small delay to ensure element is mounted
    const timer = setTimeout(apply, 50);

    return () => {
      clearTimeout(timer);
      // Cleanup grain when component unmounts
      cleanup();
    };
  }, [elementId, JSON.stringify(options)]);
};
