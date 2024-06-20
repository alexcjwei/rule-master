import { S3 } from '@aws-sdk/client-s3';
import { NodeJsClient } from '@smithy/types';

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const s3Client = new S3({
  region: 'us-east-1',
}) as NodeJsClient<S3>;

function getObjectURLFromKey(key: string | null) {
  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

function formatS3Key(id: number, filename: string, path: string = '') {
  return `${path}${id}-${filename}`;
}

export { s3Client, S3_BUCKET_NAME, getObjectURLFromKey, formatS3Key };
