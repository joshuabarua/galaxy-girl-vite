import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuToGrid from '../components/MenuToGrid/MenuToGrid';
import ContextLogo from '../components/ContextLogo/ContextLogo';
import { imagekitGalleries } from './portfolio/data/imagekitGalleryData';
import { useGrained } from '../hooks/useGrained';
import { useFadeUpStagger } from '../hooks/useFadeUpStagger';
import './css/homeMinimal.css';

/**
 * Minimal Scandinavian-style home page
 * Hero with animated logo, then straight to gallery
 */
const HomeMinimal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const HERO_KEY = 'heroSubtitleAnimated';
    const already = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem(HERO_KEY);

    if (already) return; // do not re-animate on later visits

    const handler = () => {
      try {
        const el = document.querySelector('.hero-content');
        if (el) {
          el.classList.add('hero-animated');
        }
        if (window.localStorage) window.localStorage.setItem(HERO_KEY, '1');
      } catch {}
      window.removeEventListener('route-transition-in-complete', handler);
    };

    window.addEventListener('route-transition-in-complete', handler);
    return () => window.removeEventListener('route-transition-in-complete', handler);
  }, []);

  // Apply grain to white background
  useGrained('home-minimal-bg');

  // Enable scroll snapping only on the home page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add('home-snap');
    body.classList.add('home-snap');
    return () => {
      html.classList.remove('home-snap');
      body.classList.remove('home-snap');
    };
  }, []);

  // Staggered fade-up animations for page elements
  useFadeUpStagger('.fade-up-item', {
    delay: 250, // Wait for transition to complete
    stagger: 80,
    duration: 600,
    distance: 40
  });

  return (
    <div id="home-minimal-bg" className="home-minimal">
      <ContextLogo
        initialMode="center"
        trigger={{ type: 'element', selector: '.gallery-section', start: 'top center' }}
        scaleStrategy="matchNav"
        scaleMultiplier={1.5}
        dockTargetSelector=".navbar-container"
        dockOffsets={{ x: 0, y: 0 }}
      />
      {/* Hero Section */}
      <section className="hero-section" id="hero-logo-container">
        <div className="hero-content fade-up-item">
          <p className="hero-subtitle">Makeup Artist</p>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator fade-up-item">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <MenuToGrid galleries={imagekitGalleries} />
      </section>
    </div>
  );
};

export default HomeMinimal;
