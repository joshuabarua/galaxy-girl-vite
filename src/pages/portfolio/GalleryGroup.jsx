import React, {Suspense, useState, useEffect} from 'react';
import {useTheme} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import {useParams} from 'react-router-dom';
import PhotoAlbum from 'react-photo-album';

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

	console.log('KEY', galleryId, 'photos', gallery[galleryId]);

	return (
		<>
			<div className={styles.portfolioContainer}>
				<div className={styles.portfolioHeader}>
					<h1>{gallery[galleryId].name}</h1>
				</div>

				<div className={styles.albumContainer}>
					<PhotoAlbum layout="columns" photos={gallery[galleryId].images} columns={columns} padding={5} spacing={5} />
				</div>
			</div>
		</>
	);
}
