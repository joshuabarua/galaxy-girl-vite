import React, {Suspense, useState, useEffect} from 'react';
import {useTheme} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import {useParams} from 'react-router-dom';
import PhotoAlbum from 'react-photo-album';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

//TODO: Fix gallery display of images and add lightbox
export default function GalleryGroup() {
	const [columns, setCols] = useState(3);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {galleryId} = useParams();

	const photoData = (i) => {
		return gallery[0][i].images.map((photo) => ({
			src: photo.src,
			width: photo.width,
			height: photo.height,
			srcSet: breakpoints.map((breakpoint) => {
				const height = Math.round((photo.height / photo.width) * breakpoint);
				return {
					src: photo.src,
					width: breakpoint,
					height,
				};
			}),
		}));
	};

	useEffect(() => {
		if (isSmallScreen) setCols(2);
		else setCols(3);
	}, [isSmallScreen]);

	return (
		<div className={styles.portfolioContainer}>
			<div className={styles.galleryHeader}>
				<h1>{gallery[0][galleryId].name}</h1>
			</div>
			<div className={styles.galleryGroup}>
				<PhotoAlbum layout="columns" photos={photoData(galleryId)} columns={columns} spacing={8} />
			</div>
		</div>
	);
}
