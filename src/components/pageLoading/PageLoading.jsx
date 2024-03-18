import React, {useEffect, useState} from 'react';
import './pageLoading.css';

const PageLoading = ({loading}) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let timer = setInterval;
		if (loading) {
			timer = setInterval(() => {
				setProgress((prevProgress) => {
					if (prevProgress === 100) {
						clearInterval(timer);
						return prevProgress;
					}
					return prevProgress + Math.floor(Math.random() * 4);
				});
			}, 30);
		}

		return () => {
			clearInterval(timer);
		};
	}, [loading]);

	return (
		<div className="loading-screen">
			<div className="progress-bar">
				<div className="progress" style={{width: `${progress}%`}} />
			</div>
			<p>{`${progress}`}</p>
		</div>
	);
};

export default PageLoading;
