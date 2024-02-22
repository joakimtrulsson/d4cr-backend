export const videoStorage = {
  kind: 'local',
  type: 'file',
  generateUrl: (path) => `/public/media/${path}`,
  serverRoute: {
    path: 'public/media',
  },
  storagePath: 'public/media',
};
