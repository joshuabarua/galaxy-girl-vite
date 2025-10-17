import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import Row from './Row';
import Preview from './Preview';
import { preloadImages, preloadFonts } from '../../utils/media';
import './styles.css';

gsap.registerPlugin(Flip);

/**
 * MenuToGrid - Main component that orchestrates the menu to grid animation
 */
const MenuToGrid = ({ galleries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRow, setCurrentRow] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  
  const coverRef = useRef(null);
  const closeCtrlRef = useRef(null);
  const rowRefs = useRef([]);
  const previewRefs = useRef([]);
  const mouseenterTimeline = useRef(null);

  useEffect(() => {
    // Preload images and fonts
    Promise.all([
      preloadImages('.cell__img-inner'),
      preloadFonts('gdf6msi')
    ]).then(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
    });
  }, []);

  const handleRowClick = (rowIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    setCurrentRow(rowIndex);

    const row = rowRefs.current[rowIndex];
    const preview = previewRefs.current[rowIndex];
    
    if (!row || !preview) return;

    const rowEl = row.querySelector('.row');
    const rowImages = [...row.querySelectorAll('.cell__img')];
    const rowTitle = row.querySelector('.cell__title-inner');
    const previewEl = preview.querySelector('.preview__item');
    const previewGrid = preview.querySelector('.preview__item-grid');
    const previewImages = [...preview.querySelectorAll('.preview__item-img')];
    const previewTitle = preview.querySelector('.preview__item-title-inner');
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;

    gsap.killTweensOf([cover, rowTitle]);

    gsap.timeline({
      onStart: () => {
        document.body.classList.add('oh');
        rowEl.classList.add('row--current');
        previewEl.classList.add('preview__item--current');

        gsap.set(previewImages, { opacity: 0 });

        gsap.set(cover, {
          height: rowEl.offsetHeight - 1,
          top: rowEl.getBoundingClientRect().top,
          opacity: 1
        });

        gsap.set(previewTitle, {
          yPercent: -100,
          rotation: 15,
          transformOrigin: '100% 50%'
        });

        closeCtrl.classList.add('preview__close--show');
      },
      onComplete: () => setIsAnimating(false)
    })
    .addLabel('start', 0)
    .to(cover, {
      duration: 0.9,
      ease: 'power4.inOut',
      height: window.innerHeight,
      top: 0,
    }, 'start')
    .to(rowTitle, {
      duration: 0.5,
      ease: 'power4.inOut',
      yPercent: -100,
      rotation: 0
    }, 'start')
    .add(() => {
      const flipstate = Flip.getState(rowImages, { simple: true });
      previewGrid.prepend(...rowImages);
      Flip.from(flipstate, {
        duration: 0.9,
        ease: 'power4.inOut',
        stagger: 0.04,
      })
      .to(previewImages, {
        duration: 0.9,
        ease: 'power4.inOut',
        startAt: { scale: 0, yPercent: () => gsap.utils.random(0, 200) },
        scale: 1,
        opacity: 1,
        yPercent: 0,
        stagger: 0.04
      }, 0.04 * rowImages.length);
    }, 'start')
    .to(previewTitle, {
      duration: 1,
      ease: 'power4.inOut',
      yPercent: 0,
      rotation: 0,
    }, 'start')
    .to(closeCtrl, {
      duration: 1,
      ease: 'power4.inOut',
      opacity: 1
    }, 'start');
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);

    const row = rowRefs.current[currentRow];
    const preview = previewRefs.current[currentRow];
    
    if (!row || !preview) return;

    const rowEl = row.querySelector('.row');
    const rowImages = [...preview.querySelectorAll('.cell__img')];
    const rowImagesWrap = row.querySelector('.cell__img-wrap');
    const previewEl = preview.querySelector('.preview__item');
    const previewImages = [...preview.querySelectorAll('.preview__item-img')];
    const previewTitle = preview.querySelector('.preview__item-title-inner');
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;

    gsap.timeline({
      defaults: { duration: 0.5, ease: 'power4.inOut' },
      onStart: () => document.body.classList.remove('oh'),
      onComplete: () => {
        rowEl.classList.remove('row--current');
        previewEl.classList.remove('preview__item--current');
        setIsAnimating(false);
      }
    })
    .addLabel('start', 0)
    .to([rowImages, previewImages], {
      scale: 0,
      opacity: 0,
      stagger: 0.04,
      onComplete: () => rowImagesWrap.prepend(...rowImages)
    }, 0)
    .to(previewTitle, {
      duration: 0.6,
      yPercent: 100
    }, 'start')
    .to(closeCtrl, {
      opacity: 0
    }, 'start')
    .to(cover, {
      ease: 'power4',
      height: 0,
      top: rowEl.getBoundingClientRect().top + rowEl.offsetHeight / 2
    }, 'start+=0.4')
    .to(cover, {
      duration: 0.3,
      opacity: 0
    }, 'start+=0.9');
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="menu-to-grid">
      <div className="rows">
        {galleries.map((gallery, index) => (
          <div key={index} ref={el => rowRefs.current[index] = el} className="fade-up-item">
            <Row 
              data={gallery}
              index={index}
              onClick={() => handleRowClick(index)}
              isOpen={isOpen}
            />
          </div>
        ))}
      </div>

      <div className="preview">
        {galleries.map((gallery, index) => (
          <div key={index} ref={el => previewRefs.current[index] = el}>
            <Preview 
              data={gallery}
              index={index}
              isActive={currentRow === index}
            />
          </div>
        ))}
        <button 
          ref={closeCtrlRef}
          className="preview__close"
          onClick={handleClose}
          aria-label="Close preview"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div ref={coverRef} className="cover"></div>
    </div>
  );
};

export default MenuToGrid;
