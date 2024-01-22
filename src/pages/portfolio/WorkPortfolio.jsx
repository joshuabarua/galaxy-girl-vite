import React, {useState, useEffect} from 'react';
import styles from './css/portfolioStyles.module.css';
import 'lightgallery/css/lightgallery.css';

import {gallery} from './data/galleryImgData';
import GalleryGroup from './GalleryGroup';

const WorkPortfolio = () => {
	const [imageItems, setImageItems] = useState({});
	useEffect(() => {
		setImageItems(gallery);

		return console.warn('cleanup');
	}, [imageItems]);

	//TODO: Cleanup Portfolio
	return (
		<div style={{scrollBehavior: 'smooth'}}>
			<div className={styles.portfolioContainer}>
				<div className={styles.portfolioHeader}>
					<h1>Portfolio</h1>
				</div>
				{Object.entries(imageItems).map(([key, val]) => (
					<React.Fragment key={key}>
						<GalleryGroup imageData={val} />
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default WorkPortfolio;
