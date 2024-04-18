import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import Icon from '../../common/Icon.jsx';
import useResize from '../../utils/customHooks/useResize.js';

const SpotifyEmbed = ({ attributes, element, children }) => {
  const { url } = element;
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize();

  return (
    <div
      {...attributes}
      style={{
        display: 'flex',

        justifyContent: 'center',
      }}
      {...element.attr}
    >
      <div contentEditable={false}>
        <iframe
          title='Spotify Embed'
          src={url}
          width='620px'
          height='152'
          frameBorder='0'
          allowFullScreen
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
          style={{ borderRadius: '12px' }}
        />
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

export default SpotifyEmbed;
