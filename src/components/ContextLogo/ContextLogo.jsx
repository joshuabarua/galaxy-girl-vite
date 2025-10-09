import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import './contextLogo.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ContextLogo: A page-scoped animated logo that supports configurable
 * initial placement, trigger behavior, and dock placement.
 *
 * Props:
 * - text: string (default 'Emma Barua')
 * - initialMode: 'center' | 'element' | 'navbar'
 * - elementSelector: string (required if initialMode==='element') // legacy alias for scaleFromSelector
 * - positionFromSelector?: string // element to position from (initial); defaults to elementSelector
 * - scaleFromSelector?: string // element to scale-match for initial; defaults to elementSelector
 * - trigger?:
 *    { type: 'scrollPercent', percent: number }
 *    | { type: 'element', selector: string, start: string }
 * - scaleStrategy: 'matchElement' | 'matchNav' | 'fixed'
 * - scaleMultiplier?: number (default 1)
 * - fixedScale?: number (required if scaleStrategy==='fixed')
 * - dockTargetSelector?: string (default '.navbar-container')
 * - initialOffsets?: { x?: number, y?: number }
 * - initialIncludeMargin?: boolean // if true, include margin-left/top from position element in initial top/left
 * - dockOffsets?: { x?: number, y?: number }
 * - offsets?: { x?: number, y?: number } // legacy: applied to both when provided
 * - stabilize?: 'fontsReady' | 'raf2' | 'both' // delay measurement until layout is stable
 */
const ContextLogo = ({
  text = 'Emma Barua',
  initialMode = 'center',
  elementSelector,
  positionFromSelector,
  scaleFromSelector,
  trigger,
  scaleStrategy = 'matchNav',
  scaleMultiplier = 1,
  fixedScale,
  dockTargetSelector = '.navbar-container',
  initialOffsets = {},
  initialIncludeMargin = false,
  dockOffsets = {},
  // legacy fallback
  offsets,
  stabilize
}) => {
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    // Ensure clean state per mount
    gsap.killTweensOf(logo);
    gsap.set(logo, { clearProps: 'all' });

    const waitForStability = async () => {
      try {
        if (stabilize === 'fontsReady' || stabilize === 'both') {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        }
      } catch {}
      return new Promise((resolve) => {
        if (stabilize === 'raf2' || stabilize === 'both') {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        } else {
          resolve();
        }
      });
    };

    const getNavFontSize = () => {
      const navLink = document.querySelector('.nav-link');
      return navLink ? parseFloat(window.getComputedStyle(navLink).fontSize) : null;
    };

    const getElementFontSize = (selector) => {
      const el = selector ? document.querySelector(selector) : null;
      return el ? parseFloat(window.getComputedStyle(el).fontSize) : null;
    };

    const computeDock = () => {
      const target = document.querySelector(dockTargetSelector) || document.querySelector('.navbar-minimal');
      const rect = target ? target.getBoundingClientRect() : null;
      const cs = target ? window.getComputedStyle(target) : null;
      const padLeft = cs ? parseFloat(cs.paddingLeft) || 0 : 0;
      const padTop = cs ? parseFloat(cs.paddingTop) || 0 : 0;

      // Scale calculation
      let scale = 0.2; // default fallback
      const logoFontSize = parseFloat(window.getComputedStyle(logo).fontSize);
      if (scaleStrategy === 'matchNav') {
        const navFs = getNavFontSize();
        if (navFs && logoFontSize) scale = (navFs / logoFontSize) * scaleMultiplier;
      } else if (scaleStrategy === 'matchElement' && elementSelector) {
        const elFs = getElementFontSize(elementSelector);
        if (elFs && logoFontSize) scale = (elFs / logoFontSize) * scaleMultiplier;
      } else if (scaleStrategy === 'fixed' && typeof fixedScale === 'number') {
        scale = fixedScale;
      }

      // Resolve dock offsets: prefer dockOffsets, else legacy offsets, else 0
      const dx = (dockOffsets && (dockOffsets.x ?? 0)) ?? (offsets && (offsets.x ?? 0)) ?? 0;
      const dy = (dockOffsets && (dockOffsets.y ?? 0)) ?? (offsets && (offsets.y ?? 0)) ?? 0;

      if (rect) {
        // Vertical center inside navbar
        const logoHeight = logo.getBoundingClientRect().height * scale;
        const verticalCenter = rect.top + (rect.height - logoHeight) / 2;
        return {
          top: verticalCenter + dy,
          left: rect.left + padLeft + dx,
          scale
        };
      }
      // Fallback to viewport paddings
      return { top: 24 + dy, left: 32 + dx, scale };
    };

    const setInitialState = () => {
      // 1) Set initial state by mode
      // Resolve initial offsets: prefer initialOffsets, else legacy offsets, else 0
      const ix = (initialOffsets && (initialOffsets.x ?? 0)) ?? (offsets && (offsets.x ?? 0)) ?? 0;
      const iy = (initialOffsets && (initialOffsets.y ?? 0)) ?? (offsets && (offsets.y ?? 0)) ?? 0;

      if (initialMode === 'center') {
        gsap.set(logo, { top: '50%', left: '50%', xPercent: -50, yPercent: -50, scale: 1 });
      } else if (initialMode === 'element' && (positionFromSelector || elementSelector)) {
        const posSel = positionFromSelector || elementSelector;
        const elPos = document.querySelector(posSel);
        const scaleSel = scaleFromSelector || elementSelector;
        const elScale = scaleSel ? document.querySelector(scaleSel) : null;
        if (elPos) {
          const r = elPos.getBoundingClientRect();
          let left = r.left;
          let top = r.top;
          if (initialIncludeMargin) {
            const cs = window.getComputedStyle(elPos);
            left += parseFloat(cs.marginLeft) || 0;
            top += parseFloat(cs.marginTop) || 0;
          }
          // Match element font size for initial scale (from elScale or elPos)
          const scaleSource = elScale || elPos;
          const elFs = parseFloat(window.getComputedStyle(scaleSource).fontSize);
          const logoFs = parseFloat(window.getComputedStyle(logo).fontSize);
          const initScale = elFs && logoFs ? (elFs / logoFs) : 1;
          gsap.set(logo, { top: top + iy, left: left + ix, xPercent: 0, yPercent: 0, scale: initScale });
        }
      } else if (initialMode === 'navbar') {
        const { top, left, scale } = computeDock();
        gsap.set(logo, { top, left, xPercent: 0, yPercent: 0, scale });
      }
    };

    const buildDockTimeline = () => {
      const { top: dockTop, left: dockLeft, scale: dockScale } = computeDock();
      const tl = gsap.timeline({ paused: true });
      tl.to(logo, {
        top: dockTop,
        left: dockLeft,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        scale: dockScale,
        transformOrigin: 'top left',
        duration: 0.7,
        ease: 'power2.inOut'
      });
      return tl;
    }

    const setupTriggers = (tl) => {
      let st;
      if (trigger && trigger.type === 'scrollPercent') {
        const startPx = Math.round(window.innerHeight * (trigger.percent || 0.15));
        st = ScrollTrigger.create({
          trigger: 'body',
          start: () => startPx,
          end: 'max',
          onEnter: () => tl.play(0),
          onLeaveBack: () => tl.reverse(),
          toggleActions: 'play none none reverse'
        });
      } else if (trigger && trigger.type === 'element') {
        const trg = document.querySelector(trigger.selector) || 'body';
        st = ScrollTrigger.create({
          trigger: trg,
          start: trigger.start || 'bottom top+=100',
          end: 'max',
          onEnter: () => tl.play(0),
          onLeaveBack: () => tl.reverse(),
          toggleActions: 'play none none reverse'
        });
      } else {
        // No trigger: instantly dock
        tl.progress(1);
      }
      return st;
    };

    let tl; let st;
    (async () => {
      await waitForStability();
      setInitialState();
      tl = buildDockTimeline();
      st = setupTriggers(tl);
    })();

    // 4) Cleanup
    return () => {
      if (st) st.kill();
      if (tl) tl.kill();
      gsap.killTweensOf(logo);
      gsap.set(logo, { clearProps: 'all' });
    };
  }, [
    initialMode,
    elementSelector,
    positionFromSelector,
    scaleFromSelector,
    JSON.stringify(trigger),
    scaleStrategy,
    scaleMultiplier,
    fixedScale,
    dockTargetSelector,
    (initialOffsets && initialOffsets.x) || 0,
    (initialOffsets && initialOffsets.y) || 0,
    (dockOffsets && dockOffsets.x) || 0,
    (dockOffsets && dockOffsets.y) || 0,
    initialIncludeMargin ? 1 : 0,
    stabilize || ''
  ]);

  return (
    <div ref={logoRef} className="context-logo" aria-label="Context Logo">
      {text}
    </div>
  );
};

export default ContextLogo;
