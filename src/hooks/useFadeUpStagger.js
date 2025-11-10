import { useEffect } from 'react';

export const useFadeUpStagger = (selector = '.fade-up-item', options = {}) => {
  useEffect(() => {
    const {
      delay = 1000,
      stagger = 200,
      duration = 800,
      distance = 80
    } = options;

    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${distance}px)`;
      el.style.transition = `opacity ${duration}ms cubic-bezier(0.65, 0, 0.35, 1), transform ${duration}ms cubic-bezier(0.65, 0, 0.35, 1)`;
    });

    const timer = setTimeout(() => {
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * stagger);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [selector, JSON.stringify(options)]);
};
