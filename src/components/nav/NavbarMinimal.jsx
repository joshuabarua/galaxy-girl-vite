import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DelayedLink from '../DelayedLink/DelayedLink';
import { useGrained } from '../../hooks/useGrained';

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

  const navBase =
    'relative top-0 left-0 right-0 z-[1000] bg-transparent border-b border-double border-brand/10 transition-all duration-300 ease-in-out overflow-hidden';
  const navScrolled = 'fixed bg-white/95 backdrop-blur border-b-[#e0e0e0]';

  const container = 'max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center';

  const logoLink = 'font-normal tracking-wider text-black no-underline transition-opacity duration-300 relative hover:opacity-60';
  const logoText = `${onHome ? 'opacity-0 invisible hidden' : 'opacity-100 visible'} text-2xl font-[400] transition-opacity duration-200 font-thoderanNotes`;

  const linkBase =
    "relative text-[1.2rem] font-normal tracking-wider text-[#666] no-underline transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-black after:transition-all hover:text-black hover:after:w-full";
  const linkActive = 'text-black after:w-full';

  return (
    <nav
      id="navbar-minimal-grain"
      className={`${navBase} ${scrolled ? navScrolled : ''}`}
    >
      <div className={container}>
        <DelayedLink to="/" className={logoLink} id="navbar-logo-slot">
          <span className={logoText}>Emma Barua</span>
        </DelayedLink>

        <div className="flex items-center gap-8">
          <DelayedLink
            to="/"
            className={`${linkBase} ${isActive('/') ? linkActive : ''}`}
          >
            Work
          </DelayedLink>
          <DelayedLink
            to="/resume"
            className={`${linkBase} ${isActive('/resume') ? linkActive : ''}`}
          >
            CV
          </DelayedLink>
          <DelayedLink
            to="/contact"
            className={`${linkBase} ${isActive('/contact') ? linkActive : ''}`}
          >
            Contact
          </DelayedLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMinimal;
