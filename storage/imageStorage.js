export const imageStorage = {
  kind: 'local',
  type: 'image',
  generateUrl: (path) => `/public/images/${path}`,
  serverRoute: {
    path: 'public/images',
  },
  storagePath: 'public/images',
};
