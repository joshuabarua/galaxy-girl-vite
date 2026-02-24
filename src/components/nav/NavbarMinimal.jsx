import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import DelayedLink from "../DelayedLink/DelayedLink";
import { UI_TUNING } from "../../config/uiTuning";

const NavbarMinimal = () => {
	const location = useLocation();
	const onHome = location.pathname === "/";
	const [isVisible, setIsVisible] = useState(!onHome);
	const [homeNavReady, setHomeNavReady] = useState(!onHome);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isHeroInView, setIsHeroInView] = useState(false);
	const hideTimeoutRef = useRef(null);
	const homeRevealTimeoutRef = useRef(null);
	const lastScrollY = useRef(0);
	const autoHideDelay = onHome
		? UI_TUNING.home.navAutoHideDelayMs
		: UI_TUNING.navbar.defaultAutoHideDelayMs;
	const HERO_NAV_REVEAL_DELAY_MS = UI_TUNING.home.navRevealDelayMs;

	const showNavbar = useCallback(() => {
		if (onHome && !homeNavReady) return;
		setIsVisible(true);
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}
		hideTimeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, autoHideDelay);
	}, [autoHideDelay, homeNavReady, onHome]);

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

	// On home, hide nav logo while hero title section is still in view.
	useEffect(() => {
		if (!onHome) {
			setIsHeroInView(false);
			return;
		}

		const heroEl = document.getElementById("hero-logo-container");
		if (!heroEl || typeof IntersectionObserver === "undefined") {
			setIsHeroInView(false);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				setIsHeroInView(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.2));
			},
			{ threshold: [0, 0.2, 0.4, 0.6, 0.8] },
		);

		observer.observe(heroEl);
		return () => observer.disconnect();
	}, [onHome]);

	useEffect(() => {
		if (homeRevealTimeoutRef.current) {
			clearTimeout(homeRevealTimeoutRef.current);
			homeRevealTimeoutRef.current = null;
		}

		if (onHome) {
			setHomeNavReady(false);
			setIsVisible(false);
			homeRevealTimeoutRef.current = setTimeout(() => {
				setHomeNavReady(true);
				setIsVisible(true);
				if (hideTimeoutRef.current) {
					clearTimeout(hideTimeoutRef.current);
				}
				hideTimeoutRef.current = setTimeout(() => {
					setIsVisible(false);
				}, autoHideDelay);
			}, HERO_NAV_REVEAL_DELAY_MS);
		} else {
			setHomeNavReady(true);
		}

		return () => {
			if (homeRevealTimeoutRef.current) {
				clearTimeout(homeRevealTimeoutRef.current);
				homeRevealTimeoutRef.current = null;
			}
		};
	}, [onHome, autoHideDelay]);

	useEffect(() => {
		const handleScroll = () => {
			if (onHome && !homeNavReady) return;
			const currentScrollY = window.scrollY;
			// Show navbar when scrolling up or near top
			if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
				showNavbar();
			}
			lastScrollY.current = currentScrollY;
		};

		const handleInteraction = () => {
			if (onHome && !homeNavReady) return;
			showNavbar();
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("mousemove", handleInteraction, { passive: true });
		window.addEventListener("touchstart", handleInteraction, { passive: true });
		window.addEventListener("click", handleInteraction, { passive: true });

		if (!onHome) {
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
	}, [showNavbar, onHome, homeNavReady]);

	const isActive = (path) => location.pathname === path;
	const navBase =
		"fixed top-0 left-0 right-0 z-[1000000] bg-transparent border-b border-double border-white/45 shadow-[0_10px_28px_rgba(255,255,255,0.2)] transition-all duration-300";
	const navHidden = "-translate-y-full opacity-0";

	const container =
		"max-w-[1400px] mx-auto px-4 py-2 sm:py-2.5 flex justify-between items-center";

	const logoLink =
		"font-normal tracking-wider text-black no-underline transition-opacity duration-300 relative hover:opacity-60";
	const logoText =
		"inline-flex items-center text-lg sm:text-xl leading-none font-[400] uppercase tracking-[0.08em] transition-all duration-300 ease-out";

	const linkBase =
		"relative inline-flex items-center text-[0.9rem] sm:text-[0.98rem] md:text-[1.06rem] leading-none font-normal tracking-wider text-[#4a4a4a] no-underline transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-black after:transition-all hover:text-black hover:after:w-full";
	const linkActive = "text-black after:w-full";

	// Hide navbar when menu is open or when not visible
	const shouldHide = isMenuOpen || !isVisible;
	const shouldHideLogo = onHome && isHeroInView;

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
							<span
								className={`${logoText} ${
									shouldHideLogo
										? "opacity-0 -translate-y-1 pointer-events-none"
										: "opacity-100 translate-y-0"
								}`}
								style={{ fontFamily: '"MalgivaDemoRegular", "BlovedRegular", "ZaiRoyalVogueTypewriter", serif' }}>
								EMMA BARUA
							</span>
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
