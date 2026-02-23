import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToTop = () => {
	const { pathname, key } = useLocation();

	const forceScrollTop = () => {
		const docEl = document.documentElement;
		const body = document.body;
		const scrollingEl = document.scrollingElement || docEl;
		const prevDocBehavior = docEl.style.scrollBehavior;
		const prevBodyBehavior = body.style.scrollBehavior;

		docEl.style.scrollBehavior = "auto";
		body.style.scrollBehavior = "auto";

		window.scrollTo(0, 0);
		scrollingEl.scrollTop = 0;
		docEl.scrollTop = 0;
		body.scrollTop = 0;

		const containers = [
			document.getElementById("root"),
			document.querySelector(".app-minimal"),
			document.querySelector(".route-transition-wrapper"),
			document.querySelector(".route-transition-wrapper > .relative.z-0.min-h-full"),
			document.querySelector("main"),
		];

		containers.forEach((node) => {
			if (!node) return;
			node.scrollTop = 0;
			node.scrollLeft = 0;
		});

		gsap.set(window, { scrollTo: { y: 0, autoKill: false } });

		docEl.style.scrollBehavior = prevDocBehavior;
		body.style.scrollBehavior = prevBodyBehavior;
	};

	useEffect(() => {
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual";
		}

		const onHashChange = () => forceScrollTop();
		window.addEventListener("hashchange", onHashChange);
		window.addEventListener("popstate", onHashChange);

		return () => {
			window.removeEventListener("hashchange", onHashChange);
			window.removeEventListener("popstate", onHashChange);
		};
	}, []);

	useLayoutEffect(() => {
		forceScrollTop();
		const rafId = window.requestAnimationFrame(forceScrollTop);
		const timeoutId = window.setTimeout(forceScrollTop, 120);
		const timeoutId2 = window.setTimeout(forceScrollTop, 260);

		return () => {
			window.cancelAnimationFrame(rafId);
			window.clearTimeout(timeoutId);
			window.clearTimeout(timeoutId2);
		};
	}, [pathname, key]);

	return null;
};

export default ScrollToTop;
