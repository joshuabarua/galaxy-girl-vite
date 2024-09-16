import React, {useState, useEffect} from 'react';
import {FaBars, FaFacebook, FaInstagram} from 'react-icons/fa';
import {Link as LinkR, useLocation} from 'react-router-dom';
import './navStyles.css';
import logoImg from '../../assets/GalaxyGirlLogo.png';

const Navbar = ({toggle, scrollHeight = 800, initialBackground = 'rgba(36, 0, 59, 0.02)', scrolledBackground = '#24003b'}) => {
	const [scrollNav, setScrollNav] = useState(false);
	const location = useLocation();

	const changeNav = () => {
		if (window.scrollY >= scrollHeight) {
			setScrollNav(true);
		} else {
			setScrollNav(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', changeNav);

		return () => window.removeEventListener('scroll', changeNav);
	}, []);

	const isActive = (path) => location.pathname === path;

	const background = location.pathname === '/' ? (scrollNav ? scrolledBackground : initialBackground) : scrolledBackground;

	return (
		<nav className="nav" style={{background}}>
			<div className="nav-logo">
				<LinkR className="nav-link" to="/" style={{color: scrollNav ? 'transparent' : '#ddd8ff'}}>
					<img src={logoImg} className="logo-img" alt="logo" />
				</LinkR>
			</div>
			<FaBars className="bars" onClick={toggle} />

			<div className="nav-menu">
				<LinkR className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`} to="/">
					Home
				</LinkR>
				<LinkR className={`nav-link ${isActive('/resume') ? 'nav-link-active' : ''}`} to="/resume">
					Resume
				</LinkR>
				<LinkR className={`nav-link ${isActive('/portfolio') ? 'nav-link-active' : ''}`} to="/portfolio">
					Portfolio
				</LinkR>
				<LinkR className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`} to="/contact">
					Contact
				</LinkR>
			</div>

			<div className="nav-btn">
				<a href="https://www.facebook.com/thegalaxygirl" target="_blank" rel="noreferrer">
					<FaFacebook className="icon-fb" />
				</a>
				<a href="https://www.instagram.com/emmathegalaxygirl/" target="_blank" rel="noreferrer">
					<FaInstagram className="icon-insta" />
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
