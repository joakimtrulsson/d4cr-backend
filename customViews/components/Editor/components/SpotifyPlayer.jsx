/* eslint-disable react/no-unknown-property */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import {
  component,
  fields,
  NotEditable,
} from '@keystone-6/fields-document/component-blocks';

export const spotifyPlayer = component({
  label: 'Spotify Player',
  schema: {
    url: fields.url({
      label: 'Spotify URL',
      defaultValue:
        'https://embed.spotify.com/track/3Fq4shhJdENQhwlLk9qoDx?si=8ce69c4eaf6342aa',
    }),
    altText: fields.text({
      label: 'Alt text',
      defaultValue: 'Embedded Spotiy Player',
    }),
  },
  preview: function SpotifyPlayer(props) {
    let url = props.fields.url.value;
    if (url.includes('open.spotify.com')) {
      url = url.replace('open', 'embed');
    }

    return (
      <NotEditable>
        <div
          css={{
            overflow: 'hidden',
            paddingBottom: '26.25%',
            position: 'relative',
            height: 0,
            ' iframe': {
              left: 0,
              top: 0,
              // height: '100%',
              width: '100%',
              position: 'absolute',
            },
          }}
        >
          <iframe
            title='Spotify Embed'
            src={url}
            width='100%'
            height='152'
            frameBorder='0'
            allowFullScreen
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
            style={{ borderRadius: '12px' }}
          />
        </div>
      </NotEditable>
    );
  },
});
