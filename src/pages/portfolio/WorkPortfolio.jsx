import React, {useState, useEffect, useMemo} from 'react';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import GalleryCard from './GalleryCard';
import FadeInSection from '../../components/FadeInSection/FadeInSection';

const WorkPortfolio = () => {
	return (
		<div style={{scrollBehavior: 'smooth'}}>
			<div className={styles.portfolioContainer}>
				<div className={styles.portfolioHeader}>
					<h1>Portfolio</h1>
				</div>

				<div className={styles.gallery_card_container}>
					{Object.values(gallery[0]).map((val, idx) => (
						<FadeInSection key={idx} id={idx}>
							<GalleryCard imageGroup={val} id={idx + 1} />
						</FadeInSection>
					))}
				</div>
			</div>
		</div>
	);
};

export default WorkPortfolio;
