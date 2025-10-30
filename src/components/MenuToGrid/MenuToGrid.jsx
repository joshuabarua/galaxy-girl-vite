import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { preloadImages, preloadFonts } from '../../utils/media';
import { getImageKitUrl } from '../../utils/imagekit';
import { useGrained } from '../../hooks/useGrained';
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

  // Apply grain effect to cover
  useGrained('menu-to-grid-cover', {
    grainOpacity: 0.09,
    grainDensity: 1,
    grainWidth: 1,
    grainHeight: 1
  });

  // Apply grain to each preview item
  galleries.forEach((_, index) => {
    useGrained(`preview-item-${index}`, {
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 1,
      grainHeight: 1
    });
    
    // Apply grain to each row
    useGrained(`row-${index}`, {
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 1,
      grainHeight: 1
    });
  });

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

  // Debug helper: list top fixed overlays by z-index
  const debugLogFixedOverlays = () => {
    try {
      const fixed = Array.from(document.querySelectorAll('body *'))
        .filter(el => getComputedStyle(el).position === 'fixed');
      const top = fixed
        .map(el => {
          const cs = getComputedStyle(el);
          const zi = parseInt(cs.zIndex || '0', 10) || 0;
          const selector = el.id ? `#${el.id}` : (el.className ? `.${String(el.className).split(' ').join('.')}` : el.tagName.toLowerCase());
          return { selector, zIndex: zi, display: cs.display, opacity: cs.opacity };
        })
        .sort((a,b) => b.zIndex - a.zIndex)
        .slice(0, 10);
      // eslint-disable-next-line no-console
      console.table(top);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('debugLogFixedOverlays error', e);
    }
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

    const titleTargets = rowsArrRef.current
      .map(r => r?.DOM?.title)
      .filter(Boolean);
    gsap.killTweensOf([cover, ...titleTargets]);

    const previewTitle = row.previewItem?.DOM?.title || null;
    const rowImagesOpen = Array.isArray(row.DOM.images) ? row.DOM.images.filter(Boolean) : [];
    const previewImagesOpen = Array.from(row.previewItem?.DOM?.images || []);
    const imageTargetsOpen = [...rowImagesOpen, ...previewImagesOpen];

    gsap.timeline({
      onStart: () => {
        body.classList.add('oh');
        row.DOM.el.classList.add('row--current');
        row.previewItem.DOM.el.classList.add('preview__item--current');

        gsap.set(row.previewItem.DOM.images, {opacity: 0});
        
        // set cover to be on top of the row and then animate it to cover the whole page
        gsap.set(cover, {
          height: row.DOM.el.offsetHeight - 1, // minus border width
          top: row.DOM.el.getBoundingClientRect()['top'],
          opacity: 1,
          position: 'fixed',
          left: 0,
          width: '100%'
        });
        // DEBUG
        // eslint-disable-next-line no-console
        console.group('MenuToGrid open');
        // eslint-disable-next-line no-console
        console.log('row rect', row.DOM.el.getBoundingClientRect());
        const csCover = cover ? getComputedStyle(cover) : null;
        // eslint-disable-next-line no-console
        console.log('cover computed (after set):', csCover && { zIndex: csCover.zIndex, pos: csCover.position, width: csCover.width, height: csCover.height, opacity: csCover.opacity });
        const rto = document.querySelector('.route-transition-overlay');
        if (rto) {
          const csRto = getComputedStyle(rto);
          // eslint-disable-next-line no-console
          console.log('route-transition-overlay present, z-index:', csRto.zIndex);
        }
        // debugLogFixedOverlays(); // disabled to avoid ReferenceError if treeshaken
        
        if (previewTitle) {
          gsap.set(previewTitle, {
          yPercent: -100,
          rotation: 15,
          transformOrigin: '100% 50%',
          opacity: 0
          });
        }

        closeCtrl.classList.add('preview__close--show');
      },
      onComplete: () => isAnimatingRef.current = false
    })
    .addLabel('start', 0)
    .to(cover, {
      duration: 0.7,
      ease: 'power4.inOut',
      height: window.innerHeight,
      top: 0
    }, 'start')
    .to(titleTargets, {
      duration: 0.4,
      ease: 'power4.inOut',
      yPercent: (_, target) => {
        return target.getBoundingClientRect()['top'] > row.DOM.el.getBoundingClientRect()['top'] ? 100 : -100;
      },
      rotation: 0
    }, 'start')
    .add(() => {
      mouseenterTimelineRef.current?.progress(1, false);
      const rowImages = rowImagesOpen;
      const flipstate = Flip.getState(rowImages, { simple: true });
      if (row.previewItem?.DOM?.grid && rowImages.length) {
        // DEBUG
        // eslint-disable-next-line no-console
        console.log('Prepending row images into preview grid:', rowImages.length);
        row.previewItem.DOM.grid.prepend(...rowImages);
      }
      const tlInner = gsap.timeline();
      tlInner.add(Flip.from(flipstate, {
        duration: 0.5,
        ease: 'power4.inOut',
        stagger: 0.02,
      }));
      const previewImages = previewImagesOpen;
      if (previewImages.length) {
        // eslint-disable-next-line no-console
        console.log('Animating preview images count:', previewImages.length);
        tlInner.to(previewImages, {
          duration: 0.5,
          ease: 'power4.inOut',
          startAt: { scale: 0, yPercent: () => gsap.utils.random(0, 200) },
          scale: 1,
          opacity: 1,
          yPercent: 0,
          stagger: 0.02
        }, 0.03 * (rowImages.length || 0));
      }
    }, 'start')
    .to(previewTitle ? previewTitle : [], {
      duration: 0.7,
      ease: 'power4.inOut',
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
    }, 'start')
    .to(closeCtrl, {
      duration: 0.8,
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
        duration: 0.25,
        ease: 'power4.out',
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
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.add('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
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
        duration: 0.25,
        ease: 'power4.in',
        opacity: 0,
        scale: 0.8
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
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
    
    // Build safe target lists for GSAP (avoid nulls / undefined)
    const previewTitleClose = row.previewItem?.DOM?.title || null;
    const rowImagesClose = Array.isArray(row.DOM.images) ? row.DOM.images.filter(Boolean) : [];
    const previewImagesClose = Array.from(row.previewItem?.DOM?.images || []);
    const imageTargetsClose = [...rowImagesClose, ...previewImagesClose];
    const titleTargetsClose = rowsArrRef.current.map(r => r?.DOM?.title).filter(Boolean);
    
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;
    const body = document.body;
    
    const rowRect = row.DOM.el.getBoundingClientRect();

    gsap.timeline({
      defaults: {duration: 0.5, ease: 'power4.inOut'},
      onStart: () => {
        // keep body.oh so the route overlay stays hidden during close
        closeCtrl.classList.remove('preview__close--show');
        // ensure cover starts full screen under preview
        if (cover) {
          gsap.set(cover, {
            position: 'fixed',
            left: 0,
            width: '100%',
            height: window.innerHeight,
            top: 0,
            opacity: 1,
            zIndex: 150
          });
        }
      },
      onComplete: () => {
        row.DOM.el.classList.remove('row--current');
        row.previewItem.DOM.el.classList.remove('preview__item--current');
        body.classList.remove('oh');
        isAnimatingRef.current = false;
      }
    })
    .addLabel('start', 0)
    // Fade out close button immediately
    .to(closeCtrl ? closeCtrl : [], {
      duration: 0.3,
      opacity: 0
    }, 'start')
    // Fade out title first
    .to(previewTitleClose ? previewTitleClose : [], {
      duration: 0.3,
      ease: 'power3.in',
      yPercent: 100,
      opacity: 0
    }, 'start')
    // Fade out images
    .to(imageTargetsClose, {
      duration: 0.4,
      ease: 'power3.in',
      scale: 0,
      opacity: 0,
      stagger: 0.025,
      onComplete: () => row.DOM.imagesWrap.prepend(...row.DOM.images)
    }, 'start+=0.2')
    // Shrink cover back to the row (mirror open)
    .to(cover ? cover : [], {
      duration: 1.1,
      ease: 'power4.inOut',
      height: Math.max(0, row.DOM.el.offsetHeight - 1),
      top: rowRect.top
    }, 'start')
    .to(cover ? cover : [], {
      duration: 0.2,
      opacity: 0
    }, 'start+=0.9')
    .to(titleTargetsClose, {
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
              <div id={`row-${index}`} className="row" data-row-index={index} 
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

      <div ref={coverRef} id="menu-to-grid-cover" className="cover"></div>
      
      {/* Close Button */}
      <div ref={closeCtrlRef} className="preview__close">
        <button className="preview__close-button" onClick={handleCloseClick}>×</button>
      </div>
    </div>
  );
};

export default MenuToGrid;
