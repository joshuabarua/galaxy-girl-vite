import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const SCROLL_CONTAINERS = [
	"#root",
	".app-minimal",
	".route-transition-wrapper",
	".route-transition-wrapper > .relative.z-0.min-h-full",
	"main",
];

export const forceScrollTop = () => {
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

	SCROLL_CONTAINERS.forEach((selector) => {
		const node = document.querySelector(selector);
		if (!node) return;
		node.scrollTop = 0;
		node.scrollLeft = 0;
	});

	gsap.set(window, { scrollTo: { y: 0, autoKill: false } });

	docEl.style.scrollBehavior = prevDocBehavior;
	body.style.scrollBehavior = prevBodyBehavior;
};
