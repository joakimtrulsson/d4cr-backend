import React from 'react';

export function SpotifyPlayer({ url }) {
  return (
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
  );
}
