import React, {Suspense, useState, useEffect} from 'react';
import {useTheme} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import {useParams} from 'react-router-dom';
import PhotoAlbum from 'react-photo-album';

//TODO: Fix gallery display of images and add lightbox
export default function GalleryGroup() {
	let galleryID;
	const [columns, setCols] = useState(3);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {galleryId} = useParams();

	useEffect(() => {
		if (isSmallScreen) setCols(2);
		else setCols(3);
	}, [isSmallScreen]);

	return (
		<div className={styles.portfolioContainer}>
			<div className={styles.galleryHeader}>
				<h1>{gallery[galleryId].name}</h1>
			</div>
			<div className={styles.galleryGroup}>
				<PhotoAlbum layout="columns" photos={gallery[galleryId].images} columns={columns} padding={5} spacing={5} targetRowHeight={100} />
			</div>
		</div>
	);
}
