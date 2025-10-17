import React from 'react';
import MenuToGrid from '../../components/MenuToGrid/MenuToGrid';
import { imagekitGalleries } from './data/imagekitGalleryData';
import './css/portfolioMenuToGrid.css';

/**
 * Portfolio page using MenuToGrid animation
 * This replaces the old WorkPortfolio component
 */
const PortfolioMenuToGrid = () => {
  return (
    <div className="portfolio-menu-to-grid">
      <div className="portfolio-header">
        <h1 className="portfolio-title">Portfolio</h1>
        <p className="portfolio-subtitle">Click on any category to explore the gallery</p>
      </div>
      
      <MenuToGrid galleries={imagekitGalleries} />
    </div>
  );
};

export default PortfolioMenuToGrid;
