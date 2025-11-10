import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DelayedLink from "../DelayedLink/DelayedLink";
import { useGrained } from "../../hooks/useGrained";

const NavbarMinimal = () => {
	const location = useLocation();

	const isActive = (path) => location.pathname === path;
	const onHome = location.pathname === "/";

	const navBase =
		"fixed top-0 left-0 right-0 z-[1000000] bg-transparent border-b border-double border-brand/10 transition-transform duration-300";
	const navScrolled = "bg-white/90 backdrop-blur border-b-[#e0e0e0]";

	const container =
		"max-w-[1400px] mx-auto px-4 py-3 sm:py-4 flex justify-between items-center";

	const logoLink =
		"font-normal tracking-wider text-black no-underline transition-opacity duration-300 relative hover:opacity-60";
	const logoText =
		"opacity-100 visible text-xl sm:text-2xl font-[400] transition-opacity duration-200 font-thoderanNotes";

	const linkBase =
		"relative text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-normal tracking-wider text-[#666] no-underline transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-black after:transition-all hover:text-black hover:after:w-full";
	const linkActive = "text-black after:w-full";

	return (
		<>
			<nav className={navBase}>
				<div id="" className="relative w-full h-full">
					<div className={container}>
						<DelayedLink to="/" className={logoLink} id="navbar-logo-slot">
							<span className={logoText}>Emma Barua</span>
						</DelayedLink>

						<div className="flex items-center gap-5 sm:gap-8">
							<DelayedLink
								to="/"
								className={`${linkBase} ${isActive("/") ? linkActive : ""}`}>
								Work
							</DelayedLink>
							<DelayedLink
								to="/resume"
								className={`${linkBase} ${
									isActive("/resume") ? linkActive : ""
								}`}>
								CV
							</DelayedLink>
							<DelayedLink
								to="/contact"
								className={`${linkBase} ${
									isActive("/contact") ? linkActive : ""
								}`}>
								Contact
							</DelayedLink>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default NavbarMinimal;
