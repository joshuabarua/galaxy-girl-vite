import React, { useState } from "react";

import {
	Nav,
	NavLink,
	Bars,
	NavMenu,
	NavBtn,
	IconInsta,
	IconFB,
	LogoImg,
} from "./navElements";
import logoImg from "../../assets/GalaxyGirlLogo.png";

const Navbar = ({ toggle }) => {
	const [scrollNav, setScrollNav] = useState(false);

	const changeNav = () => {
		if (window.scrollY >= 200) {
			setScrollNav(true);
		} else {
			setScrollNav(false);
		}
	};

	window.addEventListener("scroll", changeNav);

	return (
		<>
			<Nav scrollNav={scrollNav}>
				<NavLink to="/">
					<LogoImg src={logoImg} />
				</NavLink>
				<Bars onClick={toggle} />

				<NavMenu>
					<NavLink to="/" exact="true" strict="true">
						Home
					</NavLink>
					<NavLink to="/resume">CV</NavLink>
					<NavLink to="/portfolio">Portfolio</NavLink>
					<NavLink to="/contact">Contact</NavLink>
				</NavMenu>

				<NavBtn>
					<a
						href="https://www.facebook.com/thegalaxygirl"
						target="_blank"
						rel="noreferrer"
					>
						<IconFB />
					</a>
					<a
						href="https://www.instagram.com/emmathegalaxygirl/"
						target="_blank"
						rel="noreferrer"
					>
						<IconInsta />
					</a>
				</NavBtn>
			</Nav>
		</>
	);
};

export default Navbar;
