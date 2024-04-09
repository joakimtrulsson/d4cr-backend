export const imageStorage = {
  kind: 's3',
  type: 'image',
  bucketName: process.env.BUCKETEER_BUCKET_NAME,
  region: process.env.BUCKETEER_AWS_REGION,
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  pathPrefix: 'public/images/',
};
