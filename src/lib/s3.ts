import { S3Client } from '@aws-sdk/client-s3';

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const s3Client = new S3Client({ region: 'us-east-1' });

function getObjectURLFromKey(key: string | null) {
  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export { s3Client, S3_BUCKET_NAME, getObjectURLFromKey };
