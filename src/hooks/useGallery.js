import {useState, useEffect} from 'react';
//TODO: Fix dynamic imports

function useGallery() {
	const [portfolio, setPortfolio] = useState({images: []});

	async function importImage(path) {
		console.log(importImage(path));
		return await import(`../../../assets/images/${path}`).default;
	}

	let counter = 1000;
	function Incrementer() {
		counter++;
		return counter;
	}

	//Make this an individual file with paths
	const imagePaths = ['portfolio/SFX_makeup/3.jpg', 'portfolio/SFX_makeup/300H/15.jpg', 'portfolio/Period/300H/2.jpg', 'portfolio/Wedding/1.jpg'];

	useEffect(() => {
		async function buildGallery() {
			const images = await Promise.all(
				imagePaths.map(async (path, idx) => ({
					id: Incrementer(),
					index: idx,
					src: await importImage(path),
					thumb: await importImage(path),
					subHtml: '<div class="lightGallery-captions"><h4>Photo Credit</h4><p>Description</p></div>',
				}))
			);
			setPortfolio({images});
		}

		buildGallery();
	}, []);

	return portfolio;
}

export default useGallery;
