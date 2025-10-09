import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import HomeMinimal from './pages/HomeMinimal';
import ResumeMinimal from './pages/resume/ResumeMinimal';
import ContactMinimal from './pages/contact/ContactMinimal';
import NavbarMinimal from './components/nav/NavbarMinimal';
import NotFound from './pages/NotFound';

function App() {
	return (
		<Router>
			<>
				<NavbarMinimal />
				<div className="app-minimal">
					<Routes>
						<Route path="/" element={<HomeMinimal />} />
						<Route path="/resume" element={<ResumeMinimal />} />
						<Route path="/contact" element={<ContactMinimal />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</>
		</Router>
	);
}

export default App;
