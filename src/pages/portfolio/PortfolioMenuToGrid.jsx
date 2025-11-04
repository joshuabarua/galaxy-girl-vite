import React from 'react';
import MenuToGrid from '../../components/MenuToGrid/MenuToGrid';
import { imagekitGalleries } from './data/imagekitGalleryData';

/**
 * Portfolio page using MenuToGrid animation
 * This replaces the old WorkPortfolio component
 */
const PortfolioMenuToGrid = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-16 overflow-x-hidden overflow-y-auto">
      <div className="text-center px-4 py-12 sm:px-4 sm:py-8 max-w-[1200px] mx-auto">
        <h1
          className="m-0 mb-4 text-5xl sm:text-4xl font-bold text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg,#fff 0%,#999 100%)' }}
        >
          Portfolio
        </h1>
        <p className="m-0 text-[1.2rem] sm:text-base text-white/60">
          Click on any category to explore the gallery
        </p>
      </div>

      <MenuToGrid galleries={imagekitGalleries} />
    </div>
  );
};

export default PortfolioMenuToGrid;
