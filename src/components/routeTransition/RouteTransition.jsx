import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGrained } from '../../hooks/useGrained';
import './routeTransition.css';

const RouteTransition = ({ children, fadeToDuration = 200, blackHoldDuration = 50, fadeFromDuration = 200 }) => {
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(true); // true = grey visible, false = grey hidden
  const [resetOverlay, setResetOverlay] = useState(false); // true = jump to top without animation
  const [contentKey, setContentKey] = useState(location.key);
  const timeoutRef = useRef();
  const prevLocationRef = useRef(location.key);
  const isDelayedNav = useRef(false);

  // On first mount: start grey, then wipe down to reveal
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowOverlay(false); // wipe down to reveal
      try { window.dispatchEvent(new CustomEvent('route-transition-in-complete')); } catch {}
    }, fadeFromDuration);
    return () => clearTimeout(timeoutRef.current);
  }, [fadeFromDuration]);

  // Listen for delayed navigation trigger
  useEffect(() => {
    const handler = () => {
      isDelayedNav.current = true;
      // Reset to top, then wipe down to cover
      setResetOverlay(true);
      setShowOverlay(true);
      requestAnimationFrame(() => {
        setResetOverlay(false); // trigger wipe down animation
      });
    };
    window.addEventListener('delayed-navigation-start', handler);
    return () => window.removeEventListener('delayed-navigation-start', handler);
  }, []);

  // On route change: cover with grey, swap content, then reveal
  useEffect(() => {
    if (prevLocationRef.current === location.key) return;
    prevLocationRef.current = location.key;

    // If delayed nav didn't trigger overlay, do it now
    if (!isDelayedNav.current) {
      // Reset to top, then wipe down to cover
      setResetOverlay(true);
      setShowOverlay(true);
      requestAnimationFrame(() => {
        setResetOverlay(false); // trigger wipe down animation
      });
    }
    isDelayedNav.current = false;

    // Swap content after cover completes + hold duration (stay grey)
    const t1 = setTimeout(() => {
      setContentKey(location.key);
      // Wipe down to reveal new page
      const t2 = setTimeout(() => {
        setShowOverlay(false);
        try { window.dispatchEvent(new CustomEvent('route-transition-in-complete')); } catch {}
      }, fadeFromDuration);
      timeoutRef.current = t2;
    }, fadeToDuration + blackHoldDuration);

    timeoutRef.current = t1;
    return () => {
      clearTimeout(t1);
    };
  }, [location.key, fadeToDuration, blackHoldDuration, fadeFromDuration]);

  // Apply grained effect to both overlay rows
  useGrained('route-transition-grain-top', {
    grainOpacity: 0.35,
    grainWidth: 2,
    grainHeight: 2,
    patternWidth: 100,
    patternHeight: 100
  });

  useGrained('route-transition-grain-bottom', {
    grainOpacity: 0.35,
    grainWidth: 2,
    grainHeight: 2,
    patternWidth: 100,
    patternHeight: 100
  });

  return (
    <div className="route-transition-container">
      <div className="route-transition-overlay">
        {/* Top row - scales from top */}
        <div className={`overlay-row overlay-row--top ${showOverlay ? 'covering' : 'revealing'} ${resetOverlay ? 'reset' : ''}`}>
          <div id="route-transition-grain-top" className="route-transition-grain" />
        </div>
        {/* Bottom row - scales from bottom */}
        <div className={`overlay-row overlay-row--bottom ${showOverlay ? 'covering' : 'revealing'} ${resetOverlay ? 'reset' : ''}`}>
          <div id="route-transition-grain-bottom" className="route-transition-grain" />
        </div>
      </div>
      <div key={contentKey} className="route-transition-content">
        {children}
      </div>
    </div>
  );
};

export default RouteTransition;
