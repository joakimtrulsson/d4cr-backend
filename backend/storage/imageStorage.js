import dotenv from 'dotenv';

dotenv.config();

const { ASSET_BASE_URL } = process.env;

export const imageStorage = {
  kind: 'local',
  type: 'image',
  generateUrl: (path) => `${ASSET_BASE_URL}/public/${path}`,
  serverRoute: {
    path: 'public/',
  },
  storagePath: 'public/',
};