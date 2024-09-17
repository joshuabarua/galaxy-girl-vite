import React from 'react';
// import './infoSectionStyles.css';
import BrushStrokeImg from '../../../assets/images/abstract/BrushStroke4.png';
import BrushStrokeImg2 from '../../../assets/images/abstract/BrushStroke2.png';
import BrushStrokeImg3 from '../../../assets/images/abstract/BrushStroke9.png';
import BrushStrokeImg4 from '../../../assets/images/abstract/BrushStroke3.png';
import BrushStrokeImg5 from '../../../assets/images/abstract/BrushStroke6.png';

//TODO: Change pic  to emma working, Add pics of her new work sfx stuff, remove  fluff

const InfoSection = ({lightBg, lightText, imgStart, topLine, headline, darkText, description, buttonLabel, alt, imgEm, services}) => {
	return (
		<div className={`h-screen flex justify-start items-center w-screen`}>
			{/* <div className="img-wrap">
				<img
					src={BrushStrokeImg3}
					alt="imghere"
					style={{width: '5vw', minWidth: '100px', position: 'absolute', zIndex: -1, right: '-25px', marginTop: '-200px', transform: 'rotate(50deg)', opacity: '60%'}}
				/>
				<img
					src={BrushStrokeImg4}
					alt="imghere"
					style={{
						width: '5vw',
						minWidth: '150px',
						position: 'absolute',
						zIndex: -1,
						left: '50px',
						marginBottom: '-700px',
						transform: 'rotate(100deg)',
						opacity: '60%',
					}}
				/>
			</div> */}
			<div className="w-screen h-[80vh] grid grid-cols-1 md:grid-cols-2 content-start items-start md:content-center md:items-start gap-8 px-4">
				<div className="px-8 py-8 flex flex-col gap-4">
					<p className="top-line text-[#01cf71] text-[44px] leading-[1.1] font-bold tracking-[10px] uppercase text-left font-[Rowdies]"> {topLine} </p>
					<h1 className="heading text-lg md:text-2xl"> {headline} </h1>
					<p className="subtitle text-base md:text-xl"> {description} </p>
				</div>
				{imgEm && <img src={imgEm} alt={alt} className="max-w-[700px] w-full rounded-[12px] min-w-[200px] img-em" />}
			</div>
		</div>
	);
};

export default InfoSection;
