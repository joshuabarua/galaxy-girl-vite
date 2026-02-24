import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDelayedNavigation } from '../../hooks/useDelayedNavigation';
import { UI_TUNING } from '../../config/uiTuning';

const DelayedLink = ({ 
  to, 
  className, 
  children, 
  transition,
  onClick,
  ...props 
}) => {
  const location = useLocation();
  const delayedNavigate = useDelayedNavigation();
  const startedTransitionRef = useRef(false);

  const startTransitionEarly = () => {
    if (startedTransitionRef.current) return;
    startedTransitionRef.current = true;
    window.dispatchEvent(new CustomEvent('delayed-navigation-start', {
      detail: { to, options: {} }
    }));
  };

  const handlePointerDown = (e) => {
    if (location.pathname === to) return;
    if (e.button !== undefined && e.button !== 0) return;
    startTransitionEarly();
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (location.pathname === to) {
		startedTransitionRef.current = false;
      return;
    }

    if (onClick) onClick(e);

    const baseOptions = startedTransitionRef.current
      ? { skipTransitionStart: true }
      : {};

    if (to === '/') {
      delayedNavigate(to, {
        ...baseOptions,
        transition: transition || UI_TUNING.navigation.homeReturnTransition,
      });
    } else {
      delayedNavigate(to, {
        ...baseOptions,
        ...(transition ? { transition } : {}),
      });
    }

    startedTransitionRef.current = false;
  };

  return (
    <a 
      href={`#${to}`} 
      className={className}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default DelayedLink;
