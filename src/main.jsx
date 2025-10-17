import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ImageKitProvider } from '@imagekit/react';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		{import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ? (
			<ImageKitProvider
				urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
				publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
			>
				<App />
			</ImageKitProvider>
		) : (
			<App />
		)}
	</React.StrictMode>
);
