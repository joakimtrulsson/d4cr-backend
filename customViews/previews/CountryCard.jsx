import React from 'react';
import Image from 'next/image';
import ArrowRight from './assets/graphics/icons/arrow-right.svg';

export default function CountryCard({ item }) {
  return item.status === 'published' ? (
    <div className='no-decoration'>
      <div className='country-card'>
        <h2 className='heading-4 no-decoration'>{item.title}</h2>
        <Image src={ArrowRight} alt='>' />
      </div>
    </div>
  ) : null;
}
