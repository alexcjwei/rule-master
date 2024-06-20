import { S3Client } from '@aws-sdk/client-s3';
import { NodeJsClient } from '@smithy/types';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

const s3Client = new S3Client({
  region: 'us-east-1',
}) as NodeJsClient<S3Client>;

function getObjectURLFromKey(key: string | null) {
  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

async function putFile(file: File, key: string) {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });
  try {
    await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to upload file with key ${key} to S3`);
  }
}

export { s3Client, S3_BUCKET_NAME, getObjectURLFromKey, putFile };
