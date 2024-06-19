'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { S3_BUCKET_NAME, formatS3Key, s3Client } from '@/lib/s3';
import { Upload } from '@aws-sdk/lib-storage';

const createGame = async (formData: FormData) => {
  const title = formData.get('title') as string;
  if (!title) {
    throw new Error('Name is required');
  }
  try {
    await prisma.game.create({
      data: {
        title,
      },
    });
    revalidatePath('/games');
  } catch (error) {
    console.error('Failed to create game', error);
  }
};

const uploadFile = async (formData: FormData) => {
  const gameId = Number(formData.get('gameId'));
  const file = formData.get('file') as File;

  if (!file || isNaN(gameId) || !file.size) {
    throw new Error('File and gameId are required');
  }

  try {
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
    await new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: newFile.key || formatS3Key(newFile.id, file.name),
        Body: file.stream(),
        ContentType: 'application/pdf',
      },
    }).done();

    revalidatePath(`/games/${gameId}`);
  } catch (error) {
    throw new Error('Failed to create file');
  }
};

export { createGame, uploadFile };
