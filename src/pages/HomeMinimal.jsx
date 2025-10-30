import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import MenuToGrid from '../components/MenuToGrid/MenuToGrid';
import { imagekitGalleries } from './portfolio/data/imagekitGalleryData';
import { useGrained } from '../hooks/useGrained';
import './css/homeMinimal.css';

const HomeMinimal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.add('home-hide-nav');
    const hero = document.querySelector('.hero-section');
    if (!hero || !('IntersectionObserver' in window)) return () => body.classList.remove('home-hide-nav');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) body.classList.add('home-hide-nav');
        else body.classList.remove('home-hide-nav');
      });
    }, { root: null, threshold: 0.2 });
    io.observe(hero);
    return () => {
      io.disconnect();
      body.classList.remove('home-hide-nav');
    };
  }, []);

  useGrained('home-minimal-bg');

  useEffect(() => {
    const el = document.querySelector('.hero-title-text');
    if (!el) return;
    const text = el.textContent || '';
    const frag = document.createDocumentFragment();
    const nodes = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i] === ' ' ? '\u00A0' : text[i];
      const span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = ch;
      span.style.opacity = '0';
      frag.appendChild(span);
      nodes.push(span);
    }
    el.textContent = '';
    el.appendChild(frag);
    const perChar = 2; 
    const stagger = 0.1; 
    const startDelay = 0.8; 
    gsap.to(nodes, {
      opacity: 1,
      duration: perChar,
      stagger,
      ease: 'none',
      delay: startDelay
    });
    // Compute when the last char will be visible, then fade subtitle + scroll indicator
    const total = startDelay + (nodes.length - 1) * stagger + perChar;
    gsap.to('.hero-subtitle', { opacity: 1, y: 8, duration: 0.6, ease: 'power2.out', delay: total + 0.1 });
    gsap.to('.scroll-indicator', { opacity: 1, y: 6, duration: 0.6, ease: 'power2.out', delay: total + 0.2 });
  }, []);


  return (
    <div id="home-minimal-bg" className="home-minimal">
      <section className="hero-section" id="hero-logo-container">
        <div className="hero-content">
          <h1 className="hero-title" aria-label="EMMA BARUA">
            <span className="hero-title-text">EMMA BARUA</span>
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
