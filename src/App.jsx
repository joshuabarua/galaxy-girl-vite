import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import HomeMinimal from './pages/HomeMinimal';
import ResumeMinimal from './pages/resume/ResumeMinimal';
import ContactMinimal from './pages/contact/ContactMinimal';
import NavbarMinimal from './components/nav/NavbarMinimal';
import NotFound from './pages/NotFound';
import RouteTransition from './components/routeTransition/RouteTransition';
import ScrollToTop from './components/ScrollToTop';

function App() {
	return (
		<Router>
			<>
				<ScrollToTop />
				<NavbarMinimal />
				<RouteTransition>
					<div className="app-minimal">
						<Routes>
							<Route path="/" element={<HomeMinimal />} />
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
