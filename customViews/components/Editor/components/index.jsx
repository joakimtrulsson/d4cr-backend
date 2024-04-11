/** @jsxRuntime classic */
/** @jsx jsx */

import { youtubeVideo } from './YoutubeVideo';
import { spotifyPlayer } from './SpotifyPlayer';

// it's important that this file has a named export called componentBlocks
// schema.Post.ui.views import looks for a named export `componentBlocks`
export const componentBlocks = {
  youtubeVideo,
  spotifyPlayer,
};
