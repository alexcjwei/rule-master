import prisma from '@/lib/prisma';
import { insertFile } from '@/lib/vectorstore';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fileId = Number(params.id);
  if (isNaN(fileId)) {
    return new Response(null, { status: 400 });
  }
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  if (!file) {
    return new Response(null, { status: 404 });
  }

  try {
    await insertFile(file);
  } catch (error) {
    console.error('Failed to create file embeddings', error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fileId = Number(params.id);
  if (isNaN(fileId)) {
    return new Response(null, { status: 400 });
  }
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  if (!file) {
    return new Response(null, { status: 404 });
  }

  try {
    await prisma.document.deleteMany({
      where: { fileId },
    });
  } catch (error) {
    console.error('Failed to delete file embeddings', error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
