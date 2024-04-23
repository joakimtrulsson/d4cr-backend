import React from 'react';

export default function ImagesPreview({ content }) {
  var containerClass;

  if (content.images.length === 3) {
    containerClass = 'image-container-3';
  } else if (content.images.length === 2) {
    containerClass = 'image-container-2';
  } else {
    containerClass = 'image-container-1';
  }

  return (
    <div
      className={`${containerClass} flex flex-row flex-justify-center flex-align-center
        padding-tb--m `}
    >
      {content.images.map((image, index) => (
        <div key={index} className='image-wrapper borderradius--xxs'>
          {/* <Image className='center-image' src={image.url} alt={image.alt} fill={true} /> */}
          <img
            className='center-image'
            src={image.url}
            alt={image.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
