import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import getColorCode from './themes/colorCode';
import abbreviateWord from './themes/abbreviaWord';

export default function PeopleCard({ data }) {
  const { library, config } = require('@fortawesome/fontawesome-svg-core');
  library.add(fab);

  return (
    <div className='people-card bg-yellow-50 borderradius--xxs margin--xs'>
      <div className='image-wrapper bg-yellow-100'>
        {data.image && data.image.url && (
          <img
            className='center-image'
            src={data.image.url}
            alt={data.image.altText}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div className='text-wrapper margin--s flex flex-column flex-justify-between'>
        <div className=''>
          <p className='margin--zero heading-4 color-grey-700'>
            {abbreviateWord(data.fullName, 25)}
          </p>
          <p className='margin-tb--xxxs color-yellow-700'>
            {abbreviateWord(data.role, 20)}
          </p>
        </div>

        <div className=''>
          <p className='margin--zero description-text'>
            {abbreviateWord(`${data.country}, ${data.city}`, 30)}
          </p>
        </div>
        <div className=' flex flex-row flex-justify-end flex-align-center'>
          {data.socialMediaIcon1 && data.socialMediaUrl1 && (
            <a
              className=''
              target='_blank'
              href={
                data.socialMediaUrl1.startsWith('http')
                  ? data.socialMediaUrl1
                  : `http://${data.socialMediaUrl1}`
              }
              rel='noopener noreferrer'
              // passHref
            >
              <FontAwesomeIcon
                icon={['fab', data.socialMediaIcon1.iconName]}
                color={getColorCode('yellow-600')}
                width='25px'
              />
            </a>
          )}

          {data.socialMediaIcon2 && data.socialMediaUrl2 && (
            <a
              className='margin-l--xxs'
              target='_blank'
              href={
                data.socialMediaUrl2.startsWith('http')
                  ? data.socialMediaUrl2
                  : `http://${data.socialMediaUrl2}`
              }
              // passHref
              rel='noopener noreferrer'
            >
              <FontAwesomeIcon
                icon={['fab', data.socialMediaIcon2.iconName]}
                color={getColorCode('yellow-600')}
                width='25px'
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
