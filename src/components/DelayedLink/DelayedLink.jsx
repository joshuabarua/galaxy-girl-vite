import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDelayedNavigation } from '../../hooks/useDelayedNavigation';

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
    if (location.pathname === to) {
      return;
    }

    if (onClick) onClick(e);

    if (to === '/') {
      delayedNavigate(to, {
        transition: {
          fadeToDuration: 120,
          blackHoldDuration: 20,
        },
      });
    } else {
      delayedNavigate(to);
    }
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
