import React from 'react';
import styles from './css/portfolioStyles.module.css';
import {NavLink, useParams} from 'react-router-dom';

function GalleryCard({imageGroup, id}) {
	const {galleryId} = useParams();
	console.log('key', id);
	return (
		<div className={styles.gallery_card}>
			<div className={styles.gallery_card_img}>
				<img src={`${imageGroup.images[0].src}`} />
			</div>
			<h3>{imageGroup.name}</h3>
			<NavLink to={`/portfolio/gallery/${id}`}> TO GALLERY </NavLink>
		</div>
	);
}

export default GalleryCard;
