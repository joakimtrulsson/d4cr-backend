import React from 'react';
import { Tooltip } from '@keystone-ui/tooltip';

const IMAGE_MAP = {
  ACCORDION: '/public/images/sections/accordion.png',
  BANNER: '/public/images/sections/banner.png',
  CHAPTERTEASER: '/public/images/sections/chapter.png',
  IMAGE: '/public/images/sections/images.png',
  LARGEBULLETLIST: '/public/images/sections/bullet.png',
  MEDIATEXT: '/public/images/sections/mediatext.png',
  NEWSTEASER: '/public/images/sections/news.png',
  PEOPLE: '/public/images/sections/people.png',
  PRINCIPLES: '/public/images/sections/principles.png',
  WYSIWYG: '/public/images/sections/wysiwyg.png',
};

const SectionImageToolTip = ({ type }) => {
  const imageUrl = IMAGE_MAP[type];
  const imageSrc = `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`;

  return (
    <Tooltip
      content={
        <img
          style={{
            width: '300px',
          }}
          src={imageSrc}
          alt={`Description of the ${type} image`}
        />
      }
      weight='light'
      placement='top'
    >
      {(tooltipProps) => (
        <a {...tooltipProps} href='#'>
          (see example)
        </a>
      )}
    </Tooltip>
  );
};

export default SectionImageToolTip;
