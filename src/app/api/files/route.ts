import prisma from '@/lib/prisma';
import { s3Client, S3_BUCKET_NAME, formatS3Key } from '@/lib/s3';
import { Upload } from '@aws-sdk/lib-storage';
import { middleware } from '@/middleware';

export async function POST(request: Request) {
  const session = await middleware();
  const user = session?.user;
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const gameId = Number(formData.get('gameId'));

  if (!file || isNaN(gameId)) {
    return new Response(null, { status: 400 });
  }

  try {
    const newFile = await prisma.$transaction(async (prisma) => {
      // Create new File
      const newFile = await prisma.file.create({
        data: {
          name: file.name,
          game: { connect: { id: gameId } },
          createdBy: { connect: { id: user?.id } },
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
    const upload = await new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: newFile.key || formatS3Key(newFile.id, file.name),
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
