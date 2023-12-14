import React from 'react'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import './carousel.css';
import one from     '../../assets/images/em1.jpg';
import two from     '../../assets/images/creative2.svg';
import three from   '../../assets/images/portfolio/beautyEditorial/More/Original/19.jpg'
import four from    '../../assets/images/makeup.svg';
import five from    '../../assets/images/portfolio/beautyEditorial/More/Original/21.jpg';
import six from    '../../assets/images/film.svg';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const Carousel = () => {

    const responsive = {
        0: {items: 1},
        568: {items: 2},
        1024: {items: 3},
    };

    const items = [
        <img src={one} alt='' className='sliderimg'/> ,
        <img src={two} alt='' className='sliderimg'/> ,
        <img src={three} alt='' className='sliderimg'/> ,
        <img src={four} alt='' className='sliderimg'/> ,
        <img src={five} alt='' className='sliderimg'/>,
        <img src={six} alt='' className='sliderimg'/>
    ];

    const renderPrevButton = ({ isDisabled }) => {
        return <span className="imgBtns" style={{ opacity: isDisabled ? '0.5' : 1 }}> <FaArrowLeft /> </span>;
    };

    const renderNextButton = ({ isDisabled }) => {
        return <span className="imgBtns" style={{ opacity: isDisabled ? '0.5' : 1 }}> <FaArrowRight /> </span>;
    };

    return (
        <AliceCarousel
        items={items}
        autoPlay
        infinite
        responsive={responsive}
        autoPlayInterval="3000"
        autoPlayStrategy='none'
        disableDotsControls
        touchTracking={true}
        renderPrevButton={renderPrevButton}
        renderNextButton={renderNextButton} />

    )
}

export default Carousel
