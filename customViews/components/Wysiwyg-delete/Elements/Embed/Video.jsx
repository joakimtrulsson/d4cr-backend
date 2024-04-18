import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import Icon from '../../common/Icon.jsx';
import useResize from '../../utils/customHooks/useResize.js';

const Video = ({ attributes, element, children }) => {
  const { url, alt } = element;
  const [size, onMouseDown, resizing] = useResize();
  const selected = useSelected();
  const focused = useFocused();

  // Funktion för att byta ut video-URL:en
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Funktion för att extrahera YouTube-videoid från URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(
      // /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeUrl = getYouTubeEmbedUrl(url);

  console.log('youtubeUrl', youtubeUrl);

  return (
    <div
      {...attributes}
      className='embed'
      style={{
        display: 'flex',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
      }}
      {...element.attr}
    >
      <div
        contentEditable={false}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        {resizing ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              // border: '2px dashed black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon icon='videoPlayer' />
          </div>
        ) : (
          <iframe
            src={youtubeUrl}
            // frameBorder='0'
            title={alt}
            allowFullScreen
            style={{ borderRadius: '7px' }}
          />
        )}

        {selected && (
          <button
            onMouseDown={onMouseDown}
            style={{
              width: '15px',
              height: '15px',
              opacity: 1,
              background: 'transparent',
            }}
          >
            <Icon icon='resize' />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Video;
