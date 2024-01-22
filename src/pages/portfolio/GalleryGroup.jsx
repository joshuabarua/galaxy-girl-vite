import React, {Suspense, lazy} from 'react';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgRotate from 'lightgallery/plugins/rotate';
import styles from './css/portfolioStyles.module.css';
import './css/lightGallery.css';

const LazyLightGallery = lazy(() => import('lightgallery/react'));
export default function GalleryGroup(props) {
	console.log(props);
	const {name, images} = props.imageData;

	return (
		<>
			<div className={styles.albumContainer}>
				<div style={{marginBottom: '30px'}}>
					<h1>{name}</h1>
				</div>
				<div className={styles.lightGalleryContainer}>
					<Suspense fallback={<div>Loading...</div>}>
						<LazyLightGallery plugins={[lgThumbnail, lgZoom, lgRotate]} speed={500} mode='lg-slide' elementClassNames='animated-thumbnails-gallery'>
							{images.map((image) => (
								<a key={image.id} className={styles.galleryItem} href={image.src} data-lg-size={image.size} data-sub-html={image.subHtml}>
									<img className={styles.imgResponsive} src={image.thumb} alt={`img-${image.id}`} style={{margin: '20px  10px', borderRadius: '2px'}} />
								</a>
							))}
						</LazyLightGallery>
					</Suspense>
				</div>
			</div>
		</>
	);
}
