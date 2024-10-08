import React, {useState, useEffect} from 'react';
import {CircularProgress, useMediaQuery, useTheme} from '@mui/material';
import styles from './css/portfolioStyles.module.css';
import {gallery} from './data/galleryImgData';
import {useParams} from 'react-router-dom';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import FadeInSection from '../../components/FadeInSection/FadeInSection';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export default function GalleryGroup() {
	const [columns, setCols] = useState(3);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {galleryId} = useParams();
	const [imgIndex, setIndex] = useState(-1);
	const [isLoading, setIsLoading] = useState(true);

	const preloadImages = async () => {
		const imageUrls = gallery[0][galleryId].images.map((photo) => {
			return photo.src;
		});
		const loadImage = (src) => {
			new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = resolve;
				img.onerror = reject;
			});
		};
		try {
			await Promise.all(imageUrls.map(loadImage));
		} catch (error) {
			console.error('An error occurred while preloading images:', error);
		}
	};

	useEffect(() => {
		preloadImages().finally(() => {
			setIsLoading(false);
		});
	}, [galleryId]);

	useEffect(() => {
		if (isSmallScreen || gallery[0][galleryId].images.length < 3) {
			setCols(2);
		} else {
			setCols(3);
		}
	}, [isSmallScreen, galleryId]);

	const handleClick = (photoIndex) => {
		setIndex(photoIndex);
	};

	const renderPhoto = (photoAlbumObj) => {
		const {
			photo: {src, alt},
			layout: {index},
		} = photoAlbumObj;

		return isLoading ? <CircularProgress /> : <img src={src} alt={alt} style={{width: '100%', cursor: 'pointer'}} onClick={() => handleClick(index)} />;
	};

	return (
		<div className={styles.portfolioContainer}>
			<div className={styles.galleryHeader}>
				<h1>{gallery[0][galleryId].name}</h1>
			</div>
			<div className={styles.galleryGroup}>
				<PhotoAlbum
					layout="columns"
					photos={gallery[0][galleryId].images.map((photo) => ({
						src: photo.src,
						width: photo.width,
						height: photo.height,
						key: photo.id,
					}))}
					renderPhoto={renderPhoto}
					columns={columns}
					spacing={1}
					padding={2}
				/>
				<Lightbox
					slides={gallery[0][galleryId].images.map((photo) => ({
						src: photo.src,
						width: photo.width,
						height: photo.height,
					}))}
					open={imgIndex >= 0}
					index={imgIndex}
					close={() => setIndex(-1)}
					plugins={[Slideshow, Thumbnails]}
				/>
			</div>
		</div>
	);
}
