import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import getColorCode from './themes/colorCode';
import { DocumentRenderer } from '@keystone-6/document-renderer';

export default function LargeBulletListPreview({ content }) {
  const { library, config } = require('@fortawesome/fontawesome-svg-core');
  library.add(fas);

  return (
    <div className='large-bullet-list-container min-width-25 flex flex-column  flex-align-center'>
      {content.title && <h2>{content.title}</h2>}
      {content.subHeader && <p className='large-text'>{content.subHeader}</p>}

      {content.bullets.map((bullet, index) => {
        return (
          <div
            className='bullet-content full-width-height max-width-45 flex flex-row flex-align-center flex-justify-start 
                    bg-grey-25 borderradius--xxs padding--xs'
            key={index}
          >
            {content.listType === 'UNORDERED' ? (
              <FontAwesomeIcon
                icon={['fas', 'arrow-right']}
                color={getColorCode('orange-500')}
              />
            ) : (
              <FontAwesomeIcon
                icon={['fas', `${index + 1}`]}
                color={getColorCode('orange-500')}
              />
            )}
            <DocumentRenderer document={bullet.bodyText} />
          </div>
        );
      })}
    </div>
  );
}
