import React from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useNavigate } from "react-router-dom";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import SplatterEffect from "../components/SplatterEffect/SplatterEffect";
import { imagekitGalleries } from "./portfolio/data/imagekitGalleryData";
import { useGrained } from "../hooks/useGrained";
import "./homeMinimal.css";

const HomeMinimal = () => {
	const navigate = useNavigate();

	useGrained("home-minimal-bg", {
		grainOpacity: 0.04,
		bubbles: false,
		grainDensity: 1.5,
	});

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

	const initHeroSection = () => {};

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
					<SplatterEffect enabled={true} />
					<div className="hero-content text-center flex flex-col items-center gap-2 max-w-[600px] px-8 mx-auto relative z-10">
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text" ref={initHeroTitle}>
								EMMA BARUA
							</span>
						</h1>
						<p className="hero-subtitle">Makeup Artist</p>
					</div>
				</section>

				<section className="gallery-section">
					<MenuToGrid
						galleries={imagekitGalleries}
						className="page-shell"
						contentClassName="gallery-content"
					/>
				</section>
			</div>
		</div>
	);
};

export default HomeMinimal;
