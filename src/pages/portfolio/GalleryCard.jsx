import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/portfolioStyles.module.css";

function GalleryCard({ imageGroup, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/portfolio/gallery/${id}`);
  };
  return (
    <div className={styles.gallery_card} onClick={handleClick}>
      <div className={styles.gallery_card_img}>
        <img src={`${imageGroup.images[0].src}`} />
      </div>
      <div className={styles.card_text}>
        <h2>{imageGroup.name}</h2>
      </div>
    </div>
  );
}

export default GalleryCard;
