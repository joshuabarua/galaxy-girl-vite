import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { forceScrollTop } from "../utils/forceScrollTop";

const ScrollToTop = () => {
	const { pathname, key } = useLocation();

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
