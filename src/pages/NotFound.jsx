import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGrained } from '../hooks/useGrained';

function NotFound() {
	useGrained('notfound-minimal-bg', {
		grainOpacity: 0.055,
		grainDensity: 1.7,
		grainWidth: 0.95,
		grainHeight: 0.95,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
		bubbles: false,
	});

	return (
		<div
			id="notfound-minimal-bg"
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100vw',
				minHeight: '100vh',
				background: '#f5f5f5',
			}}>
			<h1>Error404</h1>
			<p>This is not the page you are looking for...</p>
			<iframe src="https://giphy.com/embed/l2JJKs3I69qfaQleE" width="480" height="218" allowFullScreen></iframe>

			<p>
				Go back to the <NavLink to="/">Homepage</NavLink>
			</p>
		</div>
	);
}

export default NotFound;
