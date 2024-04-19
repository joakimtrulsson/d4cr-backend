import React, { useState } from 'react';
import PrinciplesCard from './PrinciplesCardPreview.jsx';
import SecondaryButton from './SecondaryButton.jsx';

export default function PrinciplesPreview({ content: chapterContent }) {
  const chapterContentProp = chapterContent ? chapterContent : null;
  const [showAllCards, setShowAllCards] = useState(false);

  const handleToggleCardsVisibility = () => {
    setShowAllCards(!showAllCards);
  };

  return (
    <main className='flex flex-column flex-align-center principles margin-t--s'>
      {chapterContentProp ? (
        <>
          <div className='text-align-center'>
            <h2 className='margin-t--xxs margin--zero'>{chapterContentProp.title}</h2>
            <p className='large-text margin-t--xxs'>
              {chapterContentProp.preamble[0] && (
                <>{chapterContentProp.preamble[0].children[0].text}</>
              )}
            </p>
          </div>
          {chapterContentProp.groups[0] && (
            <>
              <h4 className={'color-grey-400'}>
                {chapterContentProp.groups[0].groupTitle}
              </h4>
              <div className='flex flex-row flex-wrap flex-justify-center flex-align-center'>
                {chapterContentProp.groups[0].principles.map((principle) => (
                  <div key={principle.id} className='card-wrapper'>
                    <PrinciplesCard
                      title={principle.principleNumber.number + '. ' + principle.title}
                      url={'/principles' + principle.slug}
                      img={
                        principle.image && principle.image.url ? principle.image.url : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {chapterContentProp.groups.length > 1 ? (
            <>
              <h4 className={'color-grey-400'}>
                {chapterContentProp.groups[1].groupTitle}
              </h4>
              <div
                className={`flex flex-row flex-wrap flex-justify-center flex-align-center ${
                  showAllCards ? '' : 'opacity-second-group'
                }`}
              >
                {chapterContentProp.groups[1].principles.map((principle) => (
                  <div key={principle.id} className='card-wrapper'>
                    <PrinciplesCard
                      title={principle.principleNumber.number + '. ' + principle.title}
                      url={'/principles' + principle.slug}
                      img={
                        principle.image && principle.image.url ? principle.image.url : ''
                      }
                    />
                  </div>
                ))}
              </div>
              {chapterContentProp.groups.length > 2 ? (
                <>
                  <div
                    className={`full-width-height flex flex-column flex-wrap flex-justify-center flex-align-center ${
                      showAllCards ? '' : 'hide-cards'
                    }`}
                  >
                    {chapterContentProp.groups.slice(2).map((group, index) => (
                      <div key={index}>
                        <h4 className={'color-grey-400 text-align-center'}>
                          {group.groupTitle}
                        </h4>
                        <div className='flex flex-row flex-wrap flex-justify-center'>
                          {group.principles.map((principle) => (
                            <div className='card-wrapper' key={principle.id}>
                              <PrinciplesCard
                                title={
                                  principle.principleNumber.number +
                                  '. ' +
                                  principle.title
                                }
                                url={'/principles' + principle.slug}
                                img={
                                  principle.image && principle.image.url
                                    ? principle.image.url
                                    : ''
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              <div className='button-wrapper margin-tb--s'>
                <SecondaryButton
                  title={`${showAllCards ? 'Minimize' : 'SEE ALL'}`}
                  // onClick={handleToggleCardsVisibility}
                />
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
