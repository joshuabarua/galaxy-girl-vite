import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import {
	imagekitGalleries,
	heroImage as taggedHeroImage,
} from "./portfolio/data/imagekitGalleryData";
import { useGrained } from "../hooks/useGrained";
import { getImageKitUrl } from "../utils/imagekit";
import "./homeMinimal.css";

gsap.registerPlugin(ScrollTrigger);

const craftFocusAreas = ["Editorial", "Film", "TV", "SFX", "Bridal"];

const HomeMinimal = () => {
	const heroSectionRef = React.useRef(null);
	const heroMediaRef = React.useRef(null);
	const heroMediaImageRef = React.useRef(null);

	const heroImage = taggedHeroImage || imagekitGalleries?.[0]?.images?.[0] || null;
	const heroImageUrl = heroImage?.imagekitPath
		? getImageKitUrl(heroImage.imagekitPath, { width: 1800, height: 1200 })
		: heroImage?.src || "";

	useGrained("home-minimal-bg", {
		grainOpacity: 0.055,
		bubbles: false,
		grainDensity: 1.7,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
	});

	React.useEffect(() => {
		if (!heroMediaRef.current || !heroSectionRef.current) return undefined;

		const mediaEl = heroMediaRef.current;
		const mediaImageEl = heroMediaImageRef.current;
		const sectionEl = heroSectionRef.current;
		let introTween;

		const ctx = gsap.context(() => {
			gsap.set(mediaEl, { scale: 1.52, yPercent: -2, transformOrigin: "50% 42%" });
			if (mediaImageEl) {
				gsap.set(mediaImageEl, { filter: "grayscale(88%) contrast(1.06) saturate(0.82)" });
			}

			introTween = gsap.to(mediaEl, {
				scale: 1.34,
				duration: 1.35,
				ease: "power2.out",
			});

			const heroTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: sectionEl,
					start: "top top",
					end: "+=120%",
					scrub: 1,
					pin: true,
					pinSpacing: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				},
			});

			heroTimeline.to(
				mediaEl,
				{
					scale: 1.02,
					yPercent: 1,
					ease: "none",
				},
				0,
			);

			if (mediaImageEl) {
				heroTimeline.to(
					mediaImageEl,
					{
						filter: "grayscale(0%) contrast(1.02) saturate(1)",
						ease: "none",
					},
					0,
				);
			}
		}, sectionEl);

		return () => {
			if (introTween) introTween.kill();
			ctx.revert();
		};
	}, [heroImageUrl]);

	const initOnContainer = (node) => {
		if (!node) {
			try {
				document.documentElement.classList.remove("home-snap");
				document.body.classList.remove("home-snap");
			} catch {}
			return;
		}
		if (typeof window !== "undefined") {
			requestAnimationFrame(() => window.scrollTo(0, 0));
		}
		try {
			document.documentElement.classList.remove("home-snap");
			document.body.classList.remove("home-snap");
		} catch {}
	};

	const initHeroSection = (node) => {
		heroSectionRef.current = node;
	};

	const initHeroTitle = (el) => {
		if (!el || el.dataset.gsapped) return;
		el.dataset.gsapped = "1";
		const originalText = el.textContent || "";
		const frag = document.createDocumentFragment();
		const chars = [];
		for (let i = 0; i < originalText.length; i++) {
			const ch = originalText[i];
			const span = document.createElement("span");
			span.className = "hero-char";
			span.textContent = ch;
			span.style.opacity = "0";
			frag.appendChild(span);
			chars.push(span);
		}
		el.textContent = "";
		el.appendChild(frag);

		const perChar = 2;
		const stagger = 0.1;
		const startDelay = 0.4;

		gsap.to(chars, {
			opacity: 1,
			duration: perChar,
			stagger,
			ease: "none",
			delay: startDelay,
		});

		const subtitleDelay = startDelay + 1;
		const scrollDelay = subtitleDelay + 1;
		gsap.to(".hero-subtitle", {
			opacity: 1,
			y: 8,
			duration: 0.6,
			ease: "power2.out",
			delay: subtitleDelay,
		});
		gsap.to(".scroll-indicator", {
			opacity: 1,
			y: 6,
			duration: 0.6,
			ease: "power2.out",
			delay: scrollDelay,
		});
	};

	return (
		<div
			id="home-minimal-bg"
			className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full"
			ref={initOnContainer}>
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
					<div className="hero-content text-center flex flex-col items-center gap-2 max-w-[600px] px-8 mx-auto relative z-10">
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text" ref={initHeroTitle}>
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
