import React, {useState, useEffect, useMemo} from 'react';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import GalleryCard from './GalleryCard';
import FadeInSection from '../../components/FadeInSection/FadeInSection';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WorkPortfolio = () => {
	useGSAP(() => {
		const pageIntroTl = gsap.timeline();

		pageIntroTl
			.set('.pageContainer', {opacity: 1})
			.from('.pageTitle-header', {
				opacity: 0,
				y: 10,
				duration: 0.5,
				delay: 0.3,
			})

			.from(
				'.g_card',
				{
					opacity: 0,
					y: 20,
					duration: 0.7,
					delay: 0.3,
					stagger: 0.3,
				},
				0.6
			);
	});
	return (
		<div style={{scrollBehavior: 'smooth'}}>
			<div className={`${styles.portfolioContainer}  `}>
				<div className={`pageContainer ${styles.portfolioHeader} opacity-0`}>
					<h1 className="pageTitle-header text-3xl">Portfolio</h1>
				</div>

				<div className={`galleryCards ${styles.gallery_card_container}`}>
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
