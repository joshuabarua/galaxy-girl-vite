import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import {useState} from 'react';
import './App.css';
import Home from './pages/index';
import Resume from './pages/resume/index';
import Contact from './pages/contact/Contact';
import Portfolio from './pages/portfolio/WorkPortfolio';
import Footer from './components/footer/Footer';
import Navbar from './components/nav/Navbar';
import Dropdown from './components/dropdown/Dropdown';
import NotFound from './pages/NotFound';
import GalleryGroup from './pages/portfolio/GalleryGroup';

function App() {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Router>
			<>
				<Navbar toggle={toggle} />
				<Dropdown isOpen={isOpen} toggle={toggle} />
				<div className="body-container">
					<div className="content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/resume" element={<Resume />} />
							<Route path="/portfolio" element={<Portfolio />} />
							<Route path="/portfolio/gallery/:galleryId" element={<GalleryGroup />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</>
		</Router>
	);
}

export default App;
