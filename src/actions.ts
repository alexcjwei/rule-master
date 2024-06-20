'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export { createGame };
