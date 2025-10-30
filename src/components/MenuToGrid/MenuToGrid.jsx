import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { preloadImages, preloadFonts } from '../../utils/media';
import { getImageKitUrl } from '../../utils/imagekit';
import { Row } from './Row';
import Preview from './Preview';
import './MenuToGrid.css';

gsap.registerPlugin(Flip);

/**
 * MenuToGrid - Exact Codrops implementation
 */
const MenuToGrid = ({ galleries }) => {
  const [isLoading, setIsLoading] = useState(true);
  const coverRef = useRef(null);
  const closeCtrlRef = useRef(null);
  const rowRefs = useRef([]);
  const previewRefs = useRef([]);
  
  // State management
  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const currentRowRef = useRef(-1);
  const rowsArrRef = useRef([]);
  const mouseenterTimelineRef = useRef(null);

  useEffect(() => {
    // Initialize immediately for hover animations
    initializeMenuToGrid();
    
    // Preload images and fonts
    Promise.all([
      preloadImages('.cell__img-inner'),
      preloadFonts('gdf6msi')
    ]).then(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
      document.body.classList.add('js');
    });
  }, []);

  const initializeMenuToGrid = () => {
    const tryInitialize = (attempts = 0) => {
      // Check if all refs are ready
      const allRefsReady = rowRefs.current.length > 0 && 
                          previewRefs.current.length > 0 &&
                          rowRefs.current.every(ref => ref !== null) &&
                          previewRefs.current.every(ref => ref !== null && ref.DOM);
      
      if (!allRefsReady && attempts < 10) {
        setTimeout(() => tryInitialize(attempts + 1), 100);
        return;
      }
      
      const rowsArr = [];
      
      // Create Row instances using refs
      rowRefs.current.forEach((rowEl, position) => {
        const previewRef = previewRefs.current[position];
        
        if (rowEl && previewRef && previewRef.DOM) {
          const rowDom = rowEl.querySelector('.row');
          const previewItem = previewRef;
          const rowInstance = new Row(rowDom, previewItem);
          rowsArr.push(rowInstance);
        }
      });
      
      rowsArrRef.current = rowsArr;
    };
    
    // Start initialization after a small delay
    setTimeout(() => tryInitialize(), 100);
  };

  const handleRowClick = (index) => {
    if (isAnimatingRef.current) return;
    
    // If rows aren't initialized yet, try to initialize them now
    if (!rowsArrRef.current || rowsArrRef.current.length === 0) {
      initializeMenuToGrid();
      setTimeout(() => handleRowClick(index), 300);
      return;
    }
    
    isAnimatingRef.current = true;
    isOpenRef.current = true;
    currentRowRef.current = index;
    
    const row = rowsArrRef.current[index];
    if (!row) {
      isAnimatingRef.current = false;
      return;
    }
    
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;
    const body = document.body;
    
    gsap.killTweensOf([cover, rowsArrRef.current.map(r => r.DOM.title)]);

    gsap.timeline({
      onStart: () => {
        body.classList.add('oh');
        row.DOM.el.classList.add('row--current');
        row.previewItem.DOM.el.classList.add('preview__item--current');

        gsap.set(row.previewItem.DOM.images, {opacity: 0});
        
        gsap.set(cover, {
          height: row.DOM.el.offsetHeight-1,
          top: row.DOM.el.getBoundingClientRect()['top'],
          opacity: 1
        });
        
        gsap.set(row.previewItem.DOM.title, {
          yPercent: -100,
          rotation: 15,
          transformOrigin: '100% 50%'
        });

        closeCtrl.classList.add('preview__close--show');
      },
      onComplete: () => isAnimatingRef.current = false
    })
    .addLabel('start', 0)
    .to(cover, {
      duration: 0.9,
      ease: 'power4.inOut',
      height: window.innerHeight,
      top: 0,
    }, 'start')
    .to(rowsArrRef.current.map(r => r.DOM.title), {
      duration: 0.5,
      ease: 'power4.inOut',
      yPercent: (_, target) => {
        return target.getBoundingClientRect()['top'] > row.DOM.el.getBoundingClientRect()['top'] ? 100 : -100;
      },
      rotation: 0
    }, 'start')
    .add(() => {
      mouseenterTimelineRef.current?.progress(1, false);
      const flipstate = Flip.getState(row.DOM.images, {simple: true});
      row.previewItem.DOM.grid.prepend(...row.DOM.images);
      Flip.from(flipstate, {
        duration: 0.9,
        ease: 'power4.inOut',
        stagger: 0.04,
      })
      .to(row.previewItem.DOM.images, {
        duration: 0.9,
        ease: 'power4.inOut',
        startAt: {scale: 0, yPercent: () => gsap.utils.random(0,200)},
        scale: 1,
        opacity: 1,
        yPercent: 0,
        stagger: 0.04
      }, 0.04*(row.DOM.images.length))
    }, 'start')
    .to(row.previewItem.DOM.title, {
      duration: 1,
      ease: 'power4.inOut',
      yPercent: 0,
      rotation: 0,
      onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
    }, 'start')
    .to(closeCtrl, {
      duration: 1,
      ease: 'power4.inOut',
      opacity: 1
    }, 'start');
  };

  const handleMouseEnter = (index) => {
    if (isOpenRef.current) return;
    
    const row = rowsArrRef.current[index];
    if (!row) return;
    
    gsap.killTweensOf([row.DOM.images, row.DOM.title]);
    
    mouseenterTimelineRef.current = gsap.timeline()
      .addLabel('start', 0)
      .to(row.DOM.images, {
        duration: 0.4,
        ease: 'power3',
        startAt: {
          scale: 0.8, 
          xPercent: 20
        },
        scale: 1,
        xPercent: 0,
        opacity: 1,
        stagger: -0.035
      }, 'start')
      .set(row.DOM.title, {transformOrigin: '0% 50%'}, 'start')
      .to(row.DOM.title, {
        duration: 0.3,
        ease: 'power1.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.add('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.6,
        ease: 'power2.out',
        startAt: {
          yPercent: 50, 
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
  };

  const handleMouseLeave = (index) => {
    if (isOpenRef.current) return;
    
    const row = rowsArrRef.current[index];
    if (!row) return;
    
    gsap.killTweensOf([row.DOM.images, row.DOM.title]);
    
    gsap.timeline()
      .addLabel('start')
      .to(row.DOM.images, {
        duration: 0.4,
        ease: 'power4',
        opacity: 0,
        scale: 0.8
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.3,
        ease: 'power1.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.6,
        ease: 'power2.out',
        startAt: {
          yPercent: 50, 
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
  };

  const handleCloseClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    isOpenRef.current = false;
    
    const currentRow = currentRowRef.current;
    const row = rowsArrRef.current[currentRow];
    if (!row) return;
    
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;
    const body = document.body;
    
    gsap.timeline({
      defaults: {duration: 0.5, ease: 'power4.inOut'},
      onStart: () => body.classList.remove('oh'),
      onComplete: () => {
        row.DOM.el.classList.remove('row--current');
        row.previewItem.DOM.el.classList.remove('preview__item--current');
        isAnimatingRef.current = false;
      }
    })
    .addLabel('start', 0)
    .to([row.DOM.images, row.previewItem.DOM.images], {
      scale: 0,
      opacity: 0,
      stagger: 0.04,
      onComplete: () => row.DOM.imagesWrap.prepend(...row.DOM.images)
    }, 0)
    .to(row.previewItem.DOM.title, {
      duration: 0.6,
      yPercent: 100
    }, 'start')
    .to(closeCtrl, {
      opacity: 0
    }, 'start')
    .to(cover, {
      ease: 'power4',
      height: 0,
      top: row.DOM.el.getBoundingClientRect()['top']+row.DOM.el.offsetHeight/2
    }, 'start+=0.4')
    .to(cover, {
      duration: 0.3,
      opacity: 0
    }, 'start+=0.9')
    .to(rowsArrRef.current.map(r => r.DOM.title), {
      yPercent: 0,
      stagger: {
        each: 0.03,
        grid: 'auto',
        from: currentRow
      }
    }, 'start+=0.4');
  };

  return (
    <div className="menu-to-grid">
      {/* Loading state */}
      {isLoading && (
        <div className="loading"></div>
      )}
      
      {/* Content Wrapper */}
      <div className="content">
        <div className="rows">
          {galleries.map((gallery, index) => (
            <div key={index} ref={el => rowRefs.current[index] = el}>
              <div className="row" data-row-index={index} 
       onClick={() => handleRowClick(index)}
       onMouseEnter={() => handleMouseEnter(index)}
       onMouseLeave={() => handleMouseLeave(index)}>
                <div className="cell cell--title">
                  <div className="cell__title-wrap">
                    <h3 className="cell__title" style={{ '--title-index': index }}>
                      <span className="cell__title-inner cell__title-inner--base">{gallery.name}</span>
                      <span className="cell__title-inner cell__title-inner--alt" aria-hidden="true">{gallery.name}</span>
                    </h3>
                  </div>
                </div>
                <div className="cell cell--image">
                  <div className="cell__img-wrap">
                    {gallery.images.slice(0, 5).map((img, idx) => {
                      const url = img.thumb
                        || (img.imagekitPath ? getImageKitUrl(img.imagekitPath, { width: 300, height: 300 }) : null)
                        || img.src
                        || '';
                      return (
                        <div 
                          key={idx} 
                          className="cell__img"
                          data-img-index={idx}
                          style={{ 
                            backgroundImage: url ? `url(${url})` : undefined,
                            '--img-index': idx
                          }}
                        >
                          <div 
                            className="cell__img-inner"
                            style={{ 
                              backgroundImage: url ? `url(${url})` : undefined,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <div className="preview">
        {galleries.map((gallery, index) => (
          <Preview 
            key={index}
            ref={el => previewRefs.current[index] = el}
            data={gallery}
            index={index}
            isActive={false}
          />
        ))}
      </div>

      <div ref={coverRef} className="cover"></div>
      
      {/* Close Button */}
      <div ref={closeCtrlRef} className="preview__close">
        <button className="preview__close-button" onClick={handleCloseClick}>×</button>
      </div>
    </div>
  );
};

export default MenuToGrid;
