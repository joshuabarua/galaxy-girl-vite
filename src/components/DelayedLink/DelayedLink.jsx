import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDelayedNavigation } from '../../hooks/useDelayedNavigation';

/**
 * Link component that delays navigation with fade transition
 * Drop-in replacement for React Router's Link
 */
const DelayedLink = ({ 
  to, 
  className, 
  children, 
  onClick,
  ...props 
}) => {
  const location = useLocation();
  const delayedNavigate = useDelayedNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    
    // Don't navigate if already on this page
    if (location.pathname === to) {
      return;
    }

    // Call custom onClick if provided
    if (onClick) onClick(e);

    // Trigger delayed navigation
    delayedNavigate(to);
  };

  return (
    <a 
      href={to} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default DelayedLink;
