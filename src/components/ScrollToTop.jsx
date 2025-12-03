import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		gsap.to(window, { duration: 0, scrollTo: { y: 0, autoKill: false } });
	}, [pathname]);

	return null;
};

export default ScrollToTop;
