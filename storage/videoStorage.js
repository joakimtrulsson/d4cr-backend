export const videoStorage = {
  kind: 's3',
  type: 'file',
  pathPrefix: 'public/media/',
  bucketName: process.env.BUCKETEER_BUCKET_NAME,
  region: process.env.BUCKETEER_AWS_REGION,
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
};
