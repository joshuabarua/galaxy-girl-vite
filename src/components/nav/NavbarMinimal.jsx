import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbarMinimal.css';

/**
 * Minimal Scandinavian-style navbar
 * Simple, clean, black and white
 */
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

  return (
    <nav className={`navbar-minimal ${scrolled ? 'navbar-scrolled' : ''} ${onHome ? '' : 'show-logo-text'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" id="navbar-logo-slot">
          <span className="navbar-logo-text">Emma Barua</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
          >
            Work
          </Link>
          <Link 
            to="/resume" 
            className={`nav-link ${isActive('/resume') ? 'nav-link-active' : ''}`}
          >
            CV
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMinimal;
