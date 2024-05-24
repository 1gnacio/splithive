import React from 'react';
import '../../styles/imageContainer.css'; // Import the CSS file for styles

const ImageContainer = ({ rightImageSrc }) => {
  return (
    <div className="image-container">
      <img 
        src='/public/images/splithive_black.png' 
        className="left-image"
        alt="Left"
      />
      <img 
        src={rightImageSrc} 
        className="right-image"
        alt="Right"
      />
    </div>
  );
};


export default ImageContainer;