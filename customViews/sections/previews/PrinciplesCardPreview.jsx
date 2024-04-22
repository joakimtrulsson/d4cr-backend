import React from 'react';
import Image from 'next/image';
// import { ReactComponent as ArrowRight } from './assets/graphics/icons/arrow-right.svg';

import ArrowRight from './assets/graphics/icons/arrow-right.svg';

const PrinciplesCard = ({ title, url, img, subHeader }) => {
  console.log(subHeader);
  return (
    <div
      className={`principles-card flex flex-row
      bg-grey-25 borderradius--xxs`}
    >
      <div className='img-container'>
        {img ? (
          <img
            className='img-size'
            width={200}
            height={100}
            src={img}
            alt='Image put in by user in principle-card'
          />
        ) : (
          <div className='no-image-placeholder'>No Image</div>
          // Or simply do not render anything or render a placeholder div
        )}
      </div>
      <div className='text-container'>
        <div className='title-text'>
          <h4 className='color-grey-700 text-overflow'>{title}</h4>
          <a className='no-decoration' href={url}></a>
        </div>
        {/* <p className='color-grey-700'>{subHeader} </p> */}

        <div className='arrow-text'>
          <a>
            Learn more
            <Image src={ArrowRight} alt='link arrow' className='arrow-right' />
            {/* <img className='arrow-right' src={ArrowRight} alt='link arrow' /> */}
            {/* <ArrowRight className='arrow-right' alt='link arrow' /> */}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrinciplesCard;
