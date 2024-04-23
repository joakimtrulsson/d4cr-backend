import React from 'react';
import ArrowLeft from './assets/graphics/buttons/secondary-btn-arrow-left.svg';
import ArrowRight from './assets/graphics/buttons/secondary-btn-arrow-right.svg';
import Image from 'next/image';

export default function SecondaryButton({ className, title, onClick }) {
  return (
    <div
      className={`secondary-button flex flex-row flex-nowrap ${className}`}
      onClick={onClick}
    >
      <Image src={ArrowLeft} alt='<' />
      <button className='flex flex-align-center'>{title}</button>
      <Image src={ArrowRight} alt='>' />
    </div>
  );
}
