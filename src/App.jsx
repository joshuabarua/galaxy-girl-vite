import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useState} from 'react';
import './App.css';
import Home from './pages/index';
import Resume from './pages/resume/index';
import Contact from './pages/contact/Contact';
import Portfolio from './pages/portfolio/WorkPortfolio';
import Footer from './components/footer/Footer';
import Navbar from './components/nav/Navbar';
import Dropdown from './components/dropdown/Dropdown';

function App() {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<Router basename={'/'}>
				<Navbar toggle={toggle} />
				<Dropdown isOpen={isOpen} toggle={toggle} />
				<Routes>
					<Route path="/" element={<Home />} exact="true" />
					<Route path="/resume" element={<Resume />} exact="true" />
					<Route path="/portfolio" element={<Portfolio />} exact="true" />
					<Route path="/contact" element={<Contact />} exact="true" />
				</Routes>
				<Footer />
			</Router>
		</>
	);
}

export default App;
