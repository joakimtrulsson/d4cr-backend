import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import getColorCode from './themes/colorCode';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import './scss/components/banner.scss';
import './scss/app.scss';

export default function BannerPreview({ content }) {
  const { library } = require('@fortawesome/fontawesome-svg-core');
  library.add(fas);

  const [isClicked, setIsClicked] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  function clickedBtn() {
    setIsClicked(true);
  }

  function exitVideo() {
    setSlideOut(true); // Start the slide-out animation
    // Wait for the animation to complete before hiding the modal
    setTimeout(() => {
      setIsClicked(false);
      setSlideOut(false);
    }, 500);
  }
  return (
    <>
      <div
        className='banner flex flex-row flex-justify-between flex-align-center bg-orange-50 
        padding--s width--l min-width-35 borderradius--xxs'
      >
        <div
          className='icon-wrapper flex flex-justify-center flex-align-center bg-orange-100 
             borderradius--half padding--s margin-l--xxs'
        >
          <FontAwesomeIcon
            icon={['fas', 'star']}
            color={getColorCode('orange-500')}
            size='lg'
          />
        </div>

        <div className='margin-lr--s'>
          <h4 className='margin--zero color-grey-700'>{content.title}</h4>
          <DocumentRenderer
            document={
              content.preamble.document ? content.preamble.document : content.preamble
            }
          />
        </div>

        <div className='margin-r--xxs'>
          <PrimaryButton title='Fill out form' onClick={clickedBtn} />
        </div>
      </div>
      <div
        className={` ${isClicked ? 'clicked' : 'not-clicked'} ${
          slideOut ? 'clicked-exit' : ''
        }`}
      >
        <div
          className={`modal flex flex-column flex-align-center ${
            slideOut ? 'slide-out' : ''
          }`}
        >
          <button onClick={exitVideo} className='btn-exit-video'>
            X
          </button>
          <div className='box'></div>
        </div>
      </div>
    </>
  );
}
