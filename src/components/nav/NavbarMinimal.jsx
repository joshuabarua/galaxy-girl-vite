import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import DelayedLink from "../DelayedLink/DelayedLink";

const NavbarMinimal = () => {
	const location = useLocation();
	const onHome = location.pathname === "/";
	const [isVisible, setIsVisible] = useState(!onHome);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const hideTimeoutRef = useRef(null);
	const lastScrollY = useRef(0);
	const autoHideDelay = onHome ? 5600 : 4000;

	const showNavbar = useCallback(() => {
		setIsVisible(true);
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}
		hideTimeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, autoHideDelay);
	}, [autoHideDelay]);

	// Watch for body.oh class (menu open state)
	useEffect(() => {
		const checkMenuOpen = () => {
			setIsMenuOpen(document.body.classList.contains('oh'));
		};
		
		checkMenuOpen();
		const observer = new MutationObserver(checkMenuOpen);
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
		
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			// Show navbar when scrolling up or near top
			if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
				showNavbar();
			}
			lastScrollY.current = currentScrollY;
		};

		const handleInteraction = () => {
			showNavbar();
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("mousemove", handleInteraction, { passive: true });
		window.addEventListener("touchstart", handleInteraction, { passive: true });
		window.addEventListener("click", handleInteraction, { passive: true });

		if (onHome) {
			setIsVisible(false);
		} else {
			showNavbar();
		}

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("mousemove", handleInteraction);
			window.removeEventListener("touchstart", handleInteraction);
			window.removeEventListener("click", handleInteraction);
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, [showNavbar, onHome]);

	const isActive = (path) => location.pathname === path;
	const navBase =
		"fixed top-0 left-0 right-0 z-[1000000] bg-transparent border-b border-double border-white/45 shadow-[0_10px_28px_rgba(255,255,255,0.2)] transition-all duration-300";
	const navHidden = "-translate-y-full opacity-0";

	const container =
		"max-w-[1400px] mx-auto px-4 py-3 sm:py-4 flex justify-between items-center";

	const logoLink =
		"font-normal tracking-wider text-black no-underline transition-opacity duration-300 relative hover:opacity-60";
	const logoText =
		"opacity-100 visible text-xl sm:text-2xl font-[400] transition-opacity duration-200 font-thoderanNotes";

	const linkBase =
		"relative text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-normal tracking-wider text-[#4a4a4a] no-underline transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-black after:transition-all hover:text-black hover:after:w-full";
	const linkActive = "text-black after:w-full";

	// Hide navbar when menu is open or when not visible
	const shouldHide = isMenuOpen || !isVisible;

	return (
		<>
			<nav className={`${navBase} ${shouldHide ? navHidden : ""} isolate`}>
				<div className="relative w-full h-full">
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 h-[200%] rounded-[4px] bg-[hsla(0,0%,100%,0.34)] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_0,black_50%,transparent_50%)] -z-10"
					/>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 h-full translate-y-full bg-[hsla(0,0%,100%,0.26)] backdrop-blur-[18px] backdrop-brightness-125 [mask-image:linear-gradient(to_bottom,black_0,black_0.5px,transparent_0.5px)] -z-10"
					/>
					<div className={container}>
						<DelayedLink to="/" className={logoLink} id="navbar-logo-slot">
							<span className={logoText}>Emma Barua</span>
						</DelayedLink>

						<div className="flex items-center gap-5 sm:gap-8">
							<DelayedLink
								to="/"
								className={`${linkBase} ${isActive("/") ? linkActive : ""}`}>
								Portfolio
							</DelayedLink>
							<DelayedLink
								to="/resume"
								className={`${linkBase} ${
									isActive("/resume") ? linkActive : ""
								}`}>
								Resume
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
