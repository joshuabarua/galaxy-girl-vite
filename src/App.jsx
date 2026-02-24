import { useEffect } from 'react';
import {HashRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import HomeMinimal from './pages/HomeMinimal';
import ResumeMinimal from './pages/resume/ResumeMinimal';
import ContactMinimal from './pages/contact/ContactMinimal';
import PortfolioDetail from './pages/portfolio/PortfolioDetail';
import NavbarMinimal from './components/nav/NavbarMinimal';
import NotFound from './pages/NotFound';
import RouteTransition from './components/routeTransition/RouteTransition';
import ScrollToTop from './components/ScrollToTop';
import { useGrained } from './hooks/useGrained';
import { UI_TUNING } from './config/uiTuning';

function RouteScrollGuard() {
	const location = useLocation();

	useEffect(() => {
		const unlock = () => {
			document.body.classList.remove('oh');
			document.documentElement.classList.remove('oh');
			document.body.style.overflowY = 'auto';
			document.body.style.overflowX = 'hidden';
			document.body.style.height = 'auto';
			document.documentElement.style.overflowY = 'auto';
			document.documentElement.style.overflowX = 'hidden';
			document.documentElement.style.height = 'auto';
			document.querySelector('.preview')?.classList.remove('preview--active');
			document.querySelector('.preview__close')?.classList.remove('preview__close--show');
		};

		unlock();
		const t1 = window.setTimeout(unlock, 120);
		const t2 = window.setTimeout(unlock, 500);
		return () => {
			window.clearTimeout(t1);
			window.clearTimeout(t2);
		};
	}, [location.pathname, location.search, location.hash]);

	return null;
}

function App() {
	useGrained('global-grain-overlay', {
		grainOpacity: UI_TUNING.grain.opacity,
		grainDensity: UI_TUNING.grain.density,
		grainWidth: UI_TUNING.grain.width,
		grainHeight: UI_TUNING.grain.height,
		grainChaos: UI_TUNING.grain.chaos,
		grainSpeed: UI_TUNING.grain.speed,
		animate: UI_TUNING.grain.animate,
		bubbles: UI_TUNING.grain.bubbles,
		zIndex: UI_TUNING.grain.zIndex,
	});

	return (
		<Router>
			<>
				<RouteScrollGuard />
				<div id="global-grain-overlay" className="fixed inset-0 pointer-events-none z-20" aria-hidden="true" />
				<ScrollToTop />
				<NavbarMinimal />
				<RouteTransition>
					<div className="app-minimal">
						<Routes>
							<Route path="/" element={<HomeMinimal />} />
							<Route path="/portfolio/:slug" element={<PortfolioDetail />} />
							<Route path="/resume" element={<ResumeMinimal />} />
							<Route path="/contact" element={<ContactMinimal />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</RouteTransition>
			</>
		</Router>
	);
}

export default App;
