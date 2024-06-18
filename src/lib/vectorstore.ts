import { File, Document } from '@prisma/client';
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getEmbedding } from '@/lib/openai';
import prisma from '@/lib/prisma';

async function insertFileById(id: number) {
  const file = await prisma.file.findUnique({
    where: { id },
  });

  if (!file) {
    throw new Error(`File ${id} not found`);
  }

  return insertFile(file);
}

async function insertFile(file: File) {
  if (!file.key) {
    throw new Error(`File ${file.id} has no key`);
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: file.key,
  });
  const response = await s3Client.send(command);
  if (!response.Body) {
    throw new Error(`File ${file.key} has no body`);
  }

  // Get the file and split it from S3
  const arrayBuffer = await response.Body.transformToByteArray();
  const blob = new Blob([arrayBuffer]);
  const loader = new PDFLoader(blob);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  // Insert into the vector store
  for (const doc of splitDocs) {
    const embedding = await getEmbedding(doc.pageContent);
    // const embeddingString = `[${embedding.join(',')}]`;
    await prisma.$transaction(async (prisma) => {
      const row = await prisma.document.create({
        data: {
          fileId: file.id,
          text: doc.pageContent,
        },
      });
      await prisma.$executeRaw`
        UPDATE documents
        SET embedding = ${`[${embedding.join(',')}]`}
        WHERE id = ${row.id}
      `;
    });
  }
}

async function search(
  text: string,
  gameId: number,
  n: number = 8
): Promise<string[]> {
  const embedding = await getEmbedding(text);
  const result = (await prisma.$queryRaw`
    SELECT * from documents
    LEFT JOIN files ON documents.file_id = files.id
    WHERE files.game_id = ${gameId}
    ORDER BY embedding <=> ${`[${embedding.join(',')}]`}
    LIMIT ${n}
  `) as any[];
  return result.map((row) => row.text) as string[];
}

export { insertFile, search };