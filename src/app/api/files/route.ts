import prisma from '@/lib/prisma';
import { s3Client, S3_BUCKET_NAME, putFile } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const gameId = Number(formData.get('gameId'));

  if (!file || isNaN(gameId)) {
    return new Response(null, { status: 400 });
  }

  try {
    // Create file in database
    const newFile = await prisma.$transaction(async (prisma) => {
      const newFile = await prisma.file.create({
        data: {
          name: file.name,
          game: { connect: { id: gameId } },
        },
      });

      // Upload file contents to S3
      if (!newFile.key) {
        throw new Error('File key not generated');
      }

      await putFile(file, newFile.key);

      return newFile;
    });
    return Response.json(newFile, { status: 200 });
  } catch (error) {
    console.error('Failed to create file', error);
    return new Response(null, { status: 500 });
  }
}
