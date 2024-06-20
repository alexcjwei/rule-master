import prisma from '@/lib/prisma';
import { s3Client, S3_BUCKET_NAME, formatS3Key } from '@/lib/s3';
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

      // Update file S3 key using the ID
      const fkey = formatS3Key(newFile.id, file.name);
      const updatedFile = await prisma.file.update({
        where: { id: newFile.id },
        data: { key: fkey },
      });

      if (!updatedFile.key) {
        throw new Error(`File ${newFile.id} has no key`);
      }

      // Upload file contents to S3
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: updatedFile.key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      });
      await s3Client.send(command);

      return updatedFile;
    });
    return Response.json(newFile, { status: 200 });
  } catch (error) {
    console.error('Failed to create file', error);
    return new Response(null, { status: 500 });
  }
}
