import prisma from '@/lib/prisma';
import { formatS3Key } from '@/lib/utils';
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const gameId = Number(formData.get('gameId'));

  if (!file || isNaN(gameId)) {
    return new Response(null, { status: 400 });
  }

  try {
    // Create File
    const f = await prisma.file.create({
      data: {
        name: file.name,
        game: { connect: { id: gameId } },
      },
    });

    // Update File S3 Key
    const fkey = formatS3Key(f.id, file.name);
    await prisma.file.update({
      where: { id: f.id },
      data: { key: fkey },
    });

    // Create file in S3 under key
    const upload = await new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: fkey,
        Body: file.stream(),
        ContentType: 'application/pdf',
      },
    }).done();

    // Pinecone
    console.log('Upload successful', upload);
  } catch (error) {
    console.error('Failed to create file', error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
