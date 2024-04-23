import React from 'react';
import Image from 'next/image';

import CountryCard from './CountryCard';

export default function ChapterTeaserPreview({ content }) {
  const title = 'Our local chapters';
  const imageSrc = `${process.env.NEXT_PUBLIC_BASE_URL}public/images/sections/mapbase.png`;

  return (
    <div className='chapter-teaser'>
      <div className='image-container'>
        <img className='full-width-height' src={imageSrc} alt='A map of the world' />
      </div>

      <div className='text-container'>
        <h1 className='heading-2'>{title}</h1>
        <div className='country-card-container'>
          {content.chapters.map((item, index) => {
            return <CountryCard key={index} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
