import React from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import MenuToGrid from '../components/MenuToGrid/MenuToGrid';
import { imagekitGalleries } from './portfolio/data/imagekitGalleryData';
import { useGrained } from '../hooks/useGrained';
import './css/homeMinimal.css';

const HomeMinimal = () => {
  const navigate = useNavigate();
  
  useGrained('home-minimal-bg');

  const initOnContainer = (node) => {
    if (!node) return; // cleanup not needed here
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  };

  const initHeroSection = (node) => {
    const body = document.body;
    if (!node) {
      body.classList.remove('home-hide-nav');
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
    const startDelay = 0.8;

    gsap.to(chars, {
      opacity: 1,
      duration: perChar,
      stagger,
      ease: 'none',
      delay: startDelay,
    });

    const total = startDelay + (chars.length - 1) * stagger + perChar;
    gsap.to('.hero-subtitle', { opacity: 1, y: 8, duration: 0.6, ease: 'power2.out', delay: total + 0.1 });
    gsap.to('.scroll-indicator', { opacity: 1, y: 6, duration: 0.6, ease: 'power2.out', delay: total + 0.2 });
  };


  return (
    <div id="home-minimal-bg" className="home-minimal" ref={initOnContainer}>
      <section className="hero-section" id="hero-logo-container" ref={initHeroSection}>
        <div className="hero-content">
          <h1 className="hero-title" aria-label="EMMA BARUA">
            <span className="hero-title-text" ref={initHeroTitle}>EMMA BARUA</span>
          </h1>
          <p className="hero-subtitle">Makeup Artist</p>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
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
