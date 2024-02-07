let images;
let portfolio;

async function importImage(path) {
	return await import(`../../../assets/images/${path}`).default;
}

let counter = 1000;
function Incrementer() {
	counter++;
	return counter;
}

const imagePaths = ['portfolio/SFX_makeup/3.jpg', 'portfolio/SFX_makeup/300H/15.jpg', 'portfolio/Period/300H/2.jpg', 'portfolio/Wedding/1.jpg'];

async function buildGallery() {
	{
		images = await Promise.all(
			imagePaths.map(async (path, idx) => {
				{
					return {
						id: Incrementer(),
						index: idx,
						src: await importImage(path),
						thumb: await importImage(path),
						subHtml: '<div class="lightGallery-captions"><h4>Photo Credit</h4><p>Description</p></div>',
					};
				}
			})
		);
	}

	portfolio = {images};
	return portfolio;
}

buildGallery().then((gallery) => {
	console.log(gallery);
});

export {portfolio, buildGallery};
