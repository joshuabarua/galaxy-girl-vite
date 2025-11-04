import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DelayedLink from '../DelayedLink/DelayedLink';
import { useGrained } from '../../hooks/useGrained';
import './navbarMinimal.css';

const NavbarMinimal = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const onHome = location.pathname === '/';

  useGrained('navbar-minimal-grain');

  return (
    <nav id="navbar-minimal-grain" className={`navbar-minimal ${scrolled ? 'navbar-scrolled' : ''} ${onHome ? '' : 'show-logo-text'}`}>
      <div className="navbar-container">
        <DelayedLink to="/" className="navbar-logo" id="navbar-logo-slot">
          <span className="navbar-logo-text">Emma Barua</span>
        </DelayedLink>

        <div className="navbar-links">
          <DelayedLink 
            to="/" 
            className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
          >
            Work
          </DelayedLink>
          <DelayedLink 
            to="/resume" 
            className={`nav-link ${isActive('/resume') ? 'nav-link-active' : ''}`}
          >
            CV
          </DelayedLink>
          <DelayedLink 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`}
          >
            Contact
          </DelayedLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMinimal;
