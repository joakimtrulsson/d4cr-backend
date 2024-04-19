import React from 'react';
import TopWave from './waves/TopWave.jsx';
import BottomWave from './waves/BottomWave.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import SecondaryButton from './SecondaryButton.jsx';
import Link from 'next/link';
import Image from 'next/image';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import getColorCode from './themes/colorCode.js';
import { useState } from 'react';

export default function MediaTextPreview({ content }) {
  const [isClicked, setIsClicked] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  let shareIsTrueCTA2;
  let shareIsTrueCTA1;
  const [shareOrSlack, setShareOrSlack] = useState('');

  if (content.cta2 && content.cta2.url) {
    // console.log(content.cta2.url, 'share funkae');

    shareIsTrueCTA2 = content.cta2.url;
  }
  if (content.cta1 && content.cta1.url) {
    // console.log(content.cta1.url);

    shareIsTrueCTA1 = content.cta1.url;
  }
  //   console.log(shareIsTrueCTA1, shareIsTrueCTA2);
  function clickedVideo() {
    // console.log(shareIsTrueCTA1);
    setShareOrSlack(shareIsTrueCTA1);
    // console.log('kontroll');
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
  var bgColorClass, fillColorCode;

  /* "bg" is for the body, and "fill" is for the svg in waves */
  if (content.backgroundColor === 'ORANGE') {
    bgColorClass = 'bg-orange-50';
    fillColorCode = getColorCode('orange-50');
  } else if (content.backgroundColor === 'YELLOW') {
    bgColorClass = 'bg-yellow-50';
    fillColorCode = getColorCode('yellow-50');
  } else {
    bgColorClass = 'bg-purple-50';
    fillColorCode = getColorCode('fill-purple-50');
  }

  return (
    <div className='text-media-section bg-transparent'>
      {(content.border === 'TOP' || content.border === 'TOPBOTTOM') && ( // top wave
        <TopWave fillColorCode={fillColorCode} />
      )}

      <div
        className={`text-and-media-container flex flex-row flex-nowrap flex-justify-center flex-align-center 
                padding-tb--l padding-lr--xl margin-tb--xxxs-negative ${bgColorClass} 
                ${content.imagePosition === 'LEFT' && 'flex-reverse-row'}`}
      >
        {' '}
        {/* check media's position */}
        <div className='text-content flex flex-column flex-nowrap width--s'>
          {' '}
          {/* text content */}
          <h2 className='sub-heading-m margin-t--xxxs margin-b--zero color-orange-600'>
            {content.title}
          </h2>
          <h3 className='heading-2 margin--zero color-orange-800'>
            {content.subHeading}
          </h3>
          <DocumentRenderer document={content.preamble} />
          {(content.cta1 || content.cta2) && (
            <>
              <nav
                className='button-container flex flex-row flex-nowrap flex-justify-start flex-align-center 
                            margin-tb--xxxs'
              >
                {content.cta1 &&
                  content.cta1.url &&
                  content.cta1.anchorText &&
                  (shareIsTrueCTA1 === 'share' || shareIsTrueCTA1 === 'slack' ? (
                    // Popup logic for CTA1
                    <>
                      <SecondaryButton
                        title={content.cta1.anchorText}
                        onClick={clickedVideo}
                      />
                      {/* <div className={` ${isClicked ? 'clicked' : 'not-clicked'} ${slideOut ? 'clicked-exit' : ''}`}>
                                                <div className={`modal flex flex-column flex-align-center ${slideOut ? 'slide-out' : ''}`}>
                                                    <button onClick={exitVideo} className="btn-exit-video">X</button>
                                                    <div className="box"><PopupForm type={shareIsTrueCTA1} /></div>
                                                </div>
                                            </div> */}
                    </>
                  ) : (
                    // Link logic for CTA1
                    <Link href={content.cta1.url} className='margin-r--xxxs'>
                      <PrimaryButton title={content.cta1.anchorText} />
                    </Link>
                  ))}

                {content.cta2 &&
                  content.cta2.url &&
                  content.cta2.anchorText &&
                  (shareIsTrueCTA2 === 'share' || shareIsTrueCTA2 === 'slack' ? (
                    // Popup logic for CTA2
                    <>
                      <SecondaryButton
                        title={content.cta2.anchorText}
                        onClick={clickedVideo}
                      />

                      {/* {<div className={` ${isClicked ? 'clicked' : 'not-clicked'} ${slideOut ? 'clicked-exit' : ''}`}>
                                                <div className={`modal flex flex-column flex-align-center ${slideOut ? 'slide-out' : ''}`}>
                                                    <button onClick={exitVideo} className="btn-exit-video">X</button>
                                                    <div className="box"><PopupForm type={shareIsTrueCTA2} /></div>
                                                </div>
                                            </div>} */}
                    </>
                  ) : (
                    // Link logic for CTA2
                    <Link className='no-decoration' href={content.cta2.url}>
                      <SecondaryButton title={content.cta2.anchorText} />
                    </Link>
                  ))}
              </nav>

              <>
                {' '}
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
                    <div className='box'>{/* <PopupForm type={'slack'} /> */}</div>
                  </div>
                </div>
              </>
            </>
          )}
        </div>
        <div className='media-content flex flex-justify-center flex-align-center borderradius--xs'>
          {' '}
          {/* media content */}
          {content.image && content.image.url && (
            // <Image
            //   className='center-image'
            //   src={content.image.url}
            //   alt={content.image.altText}
            //   fill={true}
            // />
            <img
              src={content.image.url}
              alt='description of the image'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      </div>

      {(content.border === 'BOTTOM' || content.border === 'TOPBOTTOM') && ( // bottom wave
        <BottomWave fillColorCode={fillColorCode} />
      )}
    </div>
  );
}
