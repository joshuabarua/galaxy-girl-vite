import React, {useState, useEffect, useMemo} from 'react';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import {useTheme} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import GalleryCard from './GalleryCard';

const WorkPortfolio = () => {
	return (
		<div style={{scrollBehavior: 'smooth'}}>
			<div className={styles.portfolioContainer}>
				<div className={styles.portfolioHeader}>
					<h1>Portfolio</h1>
				</div>

				<div className={styles.gallery_card_container}>
					{Object.values(gallery[0]).map((val, idx) => (
						<GalleryCard imageGroup={val} id={idx + 1} key={idx} />
					))}
				</div>
			</div>
		</div>
	);
};

export default WorkPortfolio;
