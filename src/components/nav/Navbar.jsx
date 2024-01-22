import React, {useState} from 'react';
import {FaBars, FaFacebook, FaInstagram} from 'react-icons/fa';
import {Link as LinkR} from 'react-router-dom';
import './navStyles.css';
import logoImg from '../../assets/GalaxyGirlLogo.png';

const Navbar = ({toggle, scrollHeight = 800, initialBackground = 'rgba(36, 0, 59, 0.02)', scrolledBackground = '#24003b'}) => {
	const [scrollNav, setScrollNav] = useState(false);

	const changeNav = () => {
		if (window.scrollY >= scrollHeight) {
			setScrollNav(true);
		} else {
			setScrollNav(false);
		}
	};

	window.addEventListener('scroll', changeNav);

	return (
		<>
			<nav className="nav" style={{background: scrollNav ? scrolledBackground : initialBackground}}>
				<LinkR className="nav-link" to="/">
					<img src={logoImg} className="logo-img" alt="logo" />
				</LinkR>
				<FaBars className="bars" onClick={toggle} />

				<div className="nav-menu">
					<LinkR className="nav-link" to="/" exact="true" strict="true">
						Home
					</LinkR>
					<LinkR className="nav-link" to="/resume" strict="true">
						CV
					</LinkR>
					<LinkR className="nav-link" to="/portfolio">
						Portfolio
					</LinkR>
					<LinkR className="nav-link" to="/contact">
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
		</>
	);
};

export default Navbar;
