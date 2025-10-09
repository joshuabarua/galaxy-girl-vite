import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuToGrid from '../components/MenuToGrid/MenuToGrid';
import ContextLogo from '../components/ContextLogo/ContextLogo';
import { cloudinaryGalleries } from './portfolio/data/cloudinaryGalleryData';
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

  return (
    <div className="home-minimal">
      <ContextLogo
        initialMode="center"
        trigger={{ type: 'scrollPercent', percent: 0.15 }}
        scaleStrategy="matchNav"
        scaleMultiplier={1.5}
        dockTargetSelector=".navbar-container"
        dockOffsets={{ x: 0, y: 0 }}
      />
      {/* Hero Section */}
      <section className="hero-section" id="hero-logo-container">
        <div className="hero-content">
          <p className="hero-subtitle">Makeup Artist</p>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <MenuToGrid galleries={cloudinaryGalleries} />
      </section>
    </div>
  );
};

export default HomeMinimal;
