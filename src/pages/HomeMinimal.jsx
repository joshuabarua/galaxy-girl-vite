import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import { imagekitGalleries } from "./portfolio/data/imagekitGalleryData";
import { useGrained } from "../hooks/useGrained";
import { getImageKitUrl } from "../utils/imagekit";
import "./homeMinimal.css";

gsap.registerPlugin(ScrollTrigger);

const craftFocusAreas = ["Editorial", "Film", "TV", "SFX", "Bridal"];

const HomeMinimal = () => {
	const heroSectionRef = React.useRef(null);
	const heroMediaRef = React.useRef(null);
	const heroMediaImageRef = React.useRef(null);
	const heroContentRef = React.useRef(null);

	const heroImageUrl = "https://ik.imagekit.io/t3aewf67s/hero/13_1600.jpg";

	useGrained("grain-overlay", {
		grainOpacity: 0.055,
		bubbles: false,
		grainDensity: 1.7,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
	});

	React.useEffect(() => {
		if (!heroMediaRef.current || !heroSectionRef.current || !heroContentRef.current) return undefined;

		const sectionEl = heroSectionRef.current;
		const mediaEl = heroMediaRef.current;
		const mediaImageEl = heroMediaImageRef.current;
		const contentEl = heroContentRef.current;

		const ctx = gsap.context(() => {
			// Set initial state
			gsap.set(mediaImageEl, {
				scale: 1.3,
				filter: "grayscale(88%) contrast(1.06) saturate(0.82)"
			});

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionEl,
					start: "top top",
					end: "+=70%",
					scrub: true,
					pin: true,
					pinSpacing: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				},
			});

			tl.to(mediaImageEl, {
				scale: 1,
				filter: "grayscale(0%) contrast(1.02) saturate(1)",
				ease: "none",
			}, 0);

			tl.to(contentEl, {
				opacity: 1,
				y: 0,
				ease: "none"
			}, 0);
		}, sectionEl);

		return () => {
			ctx.revert();
		};
	}, [heroImageUrl]);

	const initOnContainer = (node) => {
		if (!node) {
			try {
				document.documentElement.classList.remove("home-snap");
				document.body.classList.remove("home-snap");
			} catch { }
			return;
		}
		if (typeof window !== "undefined") {
			requestAnimationFrame(() => window.scrollTo(0, 0));
		}
		try {
			document.documentElement.classList.remove("home-snap");
			document.body.classList.remove("home-snap");
		} catch { }
	};

	const initHeroSection = (node) => {
		heroSectionRef.current = node;
	};


	return (
		<div
			id="home-minimal-bg"
			className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full"
			ref={initOnContainer}>
			<div id="grain-overlay" className="fixed inset-0 pointer-events-none z-10" aria-hidden="true" />
			<div className="page-shell">
				<section
					className="hero-section flex items-center justify-center flex-col px-8 relative"
					id="hero-logo-container"
					ref={initHeroSection}>
					{heroImageUrl && (
						<div className="hero-gallery-wrap" aria-hidden="true">
							<div className="hero-gallery hero-gallery--one" ref={heroMediaRef}>
								<div
									className="hero-gallery__item"
									ref={heroMediaImageRef}
									style={{ backgroundImage: `url(${heroImageUrl})` }}
								/>
							</div>
						</div>
					)}
					<div className="hero-atmosphere" aria-hidden="true">
						<span className="hero-atmosphere__blob hero-atmosphere__blob--primary" />
						<span className="hero-atmosphere__blob hero-atmosphere__blob--secondary" />
					</div>
					<div className="hero-content text-center flex flex-col items-center gap-2 max-w-[600px] px-8 mx-auto relative z-10" ref={heroContentRef}>
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text">
								EMMA BARUA
							</span>
						</h1>
						<div className="hero-subtitle" aria-label="Makeup artist specialties">
							<span className="hero-subtitle-prefix">Makeup Artist</span>
						</div>
					</div>
				</section>

				<section className="hero-craft-band" aria-label="Craft focus areas">
					<div className="hero-craft-inline" aria-hidden="true">
						{craftFocusAreas.map((focus, index) => (
							<React.Fragment key={focus}>
								<span className="hero-craft-item">{focus}</span>
								{index < craftFocusAreas.length - 1 && (
									<span className="hero-craft-dot">·</span>
								)}
							</React.Fragment>
						))}
					</div>
				</section>

				<section className="gallery-section">
					<MenuToGrid
						galleries={imagekitGalleries}
						className="page-shell"
						contentClassName="gallery-content"
					/>
				</section>

				<footer className="home-footer-cta">
					<p className="home-footer-cta__eyebrow">Planning a shoot?</p>
					<h2 className="home-footer-cta__title">Lets plan something together.</h2>
					<Link className="home-footer-cta__button" to="/contact">
						Start a booking
					</Link>
				</footer>
			</div>
		</div>
	);
};

export default HomeMinimal;
