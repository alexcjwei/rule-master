import prisma from '@/lib/prisma';
import { s3Client, S3_BUCKET_NAME, formatS3Key } from '@/lib/s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const gameId = Number(formData.get('gameId'));

  if (!file || isNaN(gameId)) {
    return new Response(null, { status: 400 });
  }

  try {
    console.log('Creating file in db...');
    const newFile = await prisma.$transaction(async (prisma) => {
      // Create new File
      const newFile = await prisma.file.create({
        data: {
          name: file.name,
          game: { connect: { id: gameId } },
        },
      });

      // Update File with S3 Key
      const fkey = formatS3Key(newFile.id, file.name);
      const updatedFile = await prisma.file.update({
        where: { id: newFile.id },
        data: { key: fkey },
      });

      return updatedFile;
    });

    // Create file in S3 under key
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: newFile.key || formatS3Key(newFile.id, file.name),
        Body: file.stream(),
        ContentType: 'application/pdf',
      },
    });

    console.log('Uploading file to S3...', upload);
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
    });
    await upload.done();
    console.log('Upload successful');
  } catch (error) {
    console.error('Failed to create file', error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
