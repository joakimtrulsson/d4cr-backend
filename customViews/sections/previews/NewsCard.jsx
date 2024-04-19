import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ArrowRight from './assets/graphics/icons/arrow-right.svg';
import placeholder from './assets/graphics/placeholder/dummy-image1.svg';

const Newscard = ({ type, title, url, imageUrl }) => {
  const { library, config } = require('@fortawesome/fontawesome-svg-core');
  library.add(fas);

  return (
    <main className='news-card flex flex-column '>
      <img
        src={imageUrl ? imageUrl : placeholder}
        className='img-resource'
        width={230}
        height={160}
        alt='Image put in by user in principle-card'
      />
      <Link
        className='sub-heading-div sub-heading-m text-align-center uppercase'
        href={url && url}
        style={{ pointerEvents: 'none' }}
      >
        <h5>{type && type}</h5>
      </Link>
      <Link style={{ pointerEvents: 'none' }} href={url && url} className='title-link'>
        <h3 className='title-div padding-lr--xs'>{title && title}</h3>
      </Link>

      <Link style={{ pointerEvents: 'none' }} href={url && url}>
        <Image className='arrow-right' src={ArrowRight} alt='link arrow' />
      </Link>
    </main>
  );
};

export default Newscard;
