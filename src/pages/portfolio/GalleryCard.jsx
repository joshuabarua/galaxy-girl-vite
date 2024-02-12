import React from 'react';
import styles from './css/portfolioStyles.module.css';
import {NavLink, useParams} from 'react-router-dom';

function GalleryCard({imageGroup, id}) {
	const {galleryId} = useParams();

	//TODO: Add arrows >> next to navlink
	return (
		<div className={styles.gallery_card}>
			<div className={styles.gallery_card_img}>
				<img src={`${imageGroup.images[0].src}`} />
			</div>
			<div className={styles.card_text}>
				<h2>{imageGroup.name}</h2>
				<NavLink to={`/portfolio/gallery/${id}`} className={styles.gallery_link}>
					TO GALLERY
				</NavLink>
			</div>
		</div>
	);
}

export default GalleryCard;
