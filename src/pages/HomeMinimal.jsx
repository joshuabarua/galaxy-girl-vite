import React from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useNavigate } from 'react-router-dom';
import MenuToGrid from '../components/MenuToGrid/MenuToGrid';
import { imagekitGalleries } from './portfolio/data/imagekitGalleryData';
import { useGrained } from '../hooks/useGrained';
import './css/homeMinimal.css';

const HomeMinimal = () => {
  const navigate = useNavigate();
  
  useGrained('home-minimal-bg');

  const initOnContainer = (node) => {
    if (!node) {
      try {
        const prev = window.__homeSnapNode;
        if (prev && prev._cleanupSnap) prev._cleanupSnap();
      } catch {}
      return;
    }
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
    // Enable scroll snapping for this page
    try {
      document.documentElement.classList.add('home-snap');
      document.body.classList.add('home-snap');
    } catch {}

    try { gsap.registerPlugin(ScrollToPlugin); } catch {}

    const setupSnap = (host) => {
      let animating = false;
      let sections = [];
      const compute = () => {
        const els = Array.from(document.querySelectorAll('.hero-section, .gallery-section'));
        sections = els.map(el => Math.round(window.scrollY + el.getBoundingClientRect().top));
      };
      compute();
      const toY = (y) => {
        if (ScrollToPlugin) {
          gsap.to(window, { duration: 0.6, scrollTo: { y, autoKill: false }, ease: 'power2.out', onComplete: () => { animating = false; } });
        } else {
          animating = false;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      };
      const onWheel = (e) => {
        const dy = e.deltaY || 0;
        if (dy === 0) return;
        if (animating) { e.preventDefault(); return; }
        const y = window.scrollY || window.pageYOffset || 0;
        let target = y;
        if (dy > 0) {
          target = sections.find(pos => pos > y + 2);
          if (typeof target !== 'number') target = sections[sections.length - 1] || y;
        } else {
          const prevs = sections.filter(pos => pos < y - 2);
          target = prevs.length ? prevs[prevs.length - 1] : 0;
        }
        if (Math.abs(target - y) > 4) {
          animating = true;
          e.preventDefault();
          toY(target);
          setTimeout(() => { animating = false; }, 900);
        }
      };
      const onResize = () => compute();
      // Touch support
      let touchStartY = 0;
      let touchLastY = 0;
      const onTouchStart = (e) => {
        if (!e.touches || !e.touches.length) return;
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
      };
      const onTouchMove = (e) => {
        if (!e.touches || !e.touches.length) return;
        touchLastY = e.touches[0].clientY;
      };
      const onTouchEnd = (e) => {
        const dy = touchStartY - touchLastY; // positive = swipe up
        if (Math.abs(dy) < 10) return; // ignore tiny moves
        if (animating) return;
        const y = window.scrollY || window.pageYOffset || 0;
        let target = y;
        if (dy > 0) {
          target = sections.find(pos => pos > y + 2);
          if (typeof target !== 'number') target = sections[sections.length - 1] || y;
        } else {
          const prevs = sections.filter(pos => pos < y - 2);
          target = prevs.length ? prevs[prevs.length - 1] : 0;
        }
        if (Math.abs(target - y) > 4) {
          animating = true;
          toY(target);
          setTimeout(() => { animating = false; }, 900);
        }
      };

      // Keyboard support
      const onKeyDown = (e) => {
        const keysNext = ['ArrowDown', 'PageDown', 'Space', ' '];
        const keysPrev = ['ArrowUp', 'PageUp'];
        const y = window.scrollY || window.pageYOffset || 0;
        let target = null;
        if (keysNext.includes(e.key)) {
          e.preventDefault();
          target = sections.find(pos => pos > y + 2);
          if (typeof target !== 'number') target = sections[sections.length - 1] || y;
        } else if (keysPrev.includes(e.key)) {
          e.preventDefault();
          const prevs = sections.filter(pos => pos < y - 2);
          target = prevs.length ? prevs[prevs.length - 1] : 0;
        }
        if (target !== null && Math.abs(target - y) > 4) {
          animating = true;
          toY(target);
          setTimeout(() => { animating = false; }, 900);
        }
      };

      host.addEventListener('wheel', onWheel, { passive: false });
      host.addEventListener('touchstart', onTouchStart, { passive: true });
      host.addEventListener('touchmove', onTouchMove, { passive: true });
      host.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('keydown', onKeyDown, { passive: false });
      window.addEventListener('resize', onResize);
      host._cleanupSnap = () => {
        try { host.removeEventListener('wheel', onWheel); } catch {}
        try { host.removeEventListener('touchstart', onTouchStart); } catch {}
        try { host.removeEventListener('touchmove', onTouchMove); } catch {}
        try { host.removeEventListener('touchend', onTouchEnd); } catch {}
        try { window.removeEventListener('keydown', onKeyDown); } catch {}
        try { window.removeEventListener('resize', onResize); } catch {}
      };
    };

    try { if (window.__homeSnapNode && window.__homeSnapNode._cleanupSnap) window.__homeSnapNode._cleanupSnap(); } catch {}
    window.__homeSnapNode = node;
    setupSnap(node);
  };

  const initHeroSection = (node) => {
    const body = document.body;
    if (!node) {
      body.classList.remove('home-hide-nav');
      // Disable scroll snapping when leaving page
      try {
        document.documentElement.classList.remove('home-snap');
        document.body.classList.remove('home-snap');
      } catch {}
      return;
    }
    body.classList.add('home-hide-nav');
    if ('IntersectionObserver' in window) {
      const existing = node._io;
      if (existing) existing.disconnect();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) body.classList.add('home-hide-nav');
          else body.classList.remove('home-hide-nav');
        });
      }, { root: null, threshold: 0.2 });
      io.observe(node);
      node._io = io;
    }
  };

  const initHeroTitle = (el) => {
    if (!el || el.dataset.gsapped) return;
    el.dataset.gsapped = '1';
    const originalText = el.textContent || '';
    const frag = document.createDocumentFragment();
    const chars = [];
    for (let i = 0; i < originalText.length; i++) {
      const ch = originalText[i];
      const span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = ch;
      span.style.opacity = '0';
      frag.appendChild(span);
      chars.push(span);
    }
    el.textContent = '';
    el.appendChild(frag);

    const perChar = 2;
    const stagger = 0.1;
    const startDelay = 0.4;

    gsap.to(chars, {
      opacity: 1,
      duration: perChar,
      stagger,
      ease: 'none',
      delay: startDelay,
    });

    // Start these earlier than title completion and stagger them
    const subtitleDelay = startDelay + 1;
    const scrollDelay = subtitleDelay + 1;
    gsap.to('.hero-subtitle', { opacity: 1, y: 8, duration: 0.6, ease: 'power2.out', delay: subtitleDelay });
    gsap.to('.scroll-indicator', { opacity: 1, y: 6, duration: 0.6, ease: 'power2.out', delay: scrollDelay });
  };


  return (
    <div id="home-minimal-bg" className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full" ref={initOnContainer}>
      <section className="hero-section h-screen flex items-center justify-center flex-col px-8 relative" id="hero-logo-container" ref={initHeroSection}>
        <div className="hero-content text-center flex flex-col items-center gap-2 max-w-[600px] px-8 mx-auto">
          <h1 className="hero-title" aria-label="EMMA BARUA">
            <span className="hero-title-text" ref={initHeroTitle}>EMMA BARUA</span>
          </h1>
          <p className="hero-subtitle">Makeup Artist</p>
        </div>
        <div className="scroll-indicator flex flex-col items-center justify-center gap-1.5">
          <span className="scroll-text text-[0.9rem] tracking-[0.2em] uppercase text-[#999] font-normal">Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      <section className="gallery-section">
        <MenuToGrid galleries={imagekitGalleries} />
      </section>
    </div>
  );
};

export default HomeMinimal;
