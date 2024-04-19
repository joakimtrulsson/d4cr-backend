import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';

import { YouTubeVideo } from './YouTubeVideo';
import { SpotifyPlayer } from './SpotifyPlayer';

const customComponentRenderers = {
  youtubeVideo: (props) => {
    return <YouTubeVideo {...props} />;
  },
  spotifyPlayer: (props) => {
    return (
      <React.Fragment>
        <SpotifyPlayer {...props} />
      </React.Fragment>
    );
  },
};

const defaultElementRenderers = {
  block: {
    paragraph: ({ children, textAlign }) => {
      return (
        <p style={{ textAlign }}>
          {/* <p className='bg-yellow-100' style={{ textAlign }}> */}
          {children}
        </p>
      );
    },
  },
};

export function CustomRenderer({ document }) {
  return (
    <DocumentRenderer
      renderers={defaultElementRenderers}
      componentBlocks={customComponentRenderers}
      document={document}
    />
  );
}
