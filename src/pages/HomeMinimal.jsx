import React from "react";
import { Link } from "react-router-dom";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import { imagekitGalleries } from "./portfolio/data/imagekitGalleryData";
import { useGrained } from "../hooks/useGrained";
import "./homeMinimal.css";

const HomeMinimal = () => {
	const heroImageUrl = "https://ik.imagekit.io/t3aewf67s/hero/13_1600.jpg";

	useGrained("grain-overlay", {
		grainOpacity: 0.055,
		bubbles: false,
		grainDensity: 1.7,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
	});

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

	return (
		<div
			id="home-minimal-bg"
			className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full"
			ref={initOnContainer}>
			<div id="grain-overlay" className="fixed inset-0 pointer-events-none z-10" aria-hidden="true" />
			<div className="page-shell">
				<section
					className="hero-section"
					id="hero-logo-container">
					{heroImageUrl && (
						<div className="hero-gallery-wrap" aria-hidden="true">
							<div
								className="hero-gallery__item"
								style={{ backgroundImage: `url(${heroImageUrl})` }}
							/>
						</div>
					)}
					<div className="hero-atmosphere" aria-hidden="true">
						<span className="hero-atmosphere__blob hero-atmosphere__blob--primary" />
						<span className="hero-atmosphere__blob hero-atmosphere__blob--secondary" />
					</div>
					<div className="hero-content">
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text">
								EMMA BARUA
							</span>
						</h1>
						<div className="hero-subtitle" aria-label="Makeup artist">
							<span className="hero-subtitle-prefix">Makeup Artist</span>
						</div>
						<div className="hero-disciplines" aria-label="Specialties">
							<span>FILM</span>
							<span className="hero-disciplines__dot">·</span>
							<span>TV</span>
							<span className="hero-disciplines__dot">·</span>
							<span>EDITORIAL</span>
						</div>
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

