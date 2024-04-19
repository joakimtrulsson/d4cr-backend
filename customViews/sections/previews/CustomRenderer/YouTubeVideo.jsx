export function YouTubeVideo({ url, altText = 'Embedded YouTube video' }) {
  const embedId = getYouTubeEmbedId(url);

  return (
    <iframe
      width='100%'
      height='480'
      style={{
        left: 0,
        top: 0,
      }}
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      title={altText}
    />
  );
}

function getYouTubeEmbedId(url) {
  let embedId = '';
  const parsedUrl = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (parsedUrl[2] !== undefined) {
    const parsedId = parsedUrl[2].split(/[^0-9a-z_\-]/i);
    embedId = parsedId[0];
  } else {
    embedId = url;
  }
  return embedId;
}
