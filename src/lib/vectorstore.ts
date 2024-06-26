import { File } from '@prisma/client';
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getEmbedding } from '@/lib/openai';
import prisma from '@/lib/prisma';

async function insertFile(file: File) {
  if (!file.key) {
    throw new Error(`File ${file.id} has no key`);
  }

  try {
    console.log('Getting file from S3...');
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: file.key,
    });
    const response = await s3Client.send(command);
    if (!response.Body) {
      throw new Error(`File ${file.key} has no body`);
    }

    // Get the file and split it from S3
    console.log('Loading file...');
    const arrayBuffer = await response.Body.transformToByteArray();
    console.log('Loaded', arrayBuffer.byteLength, 'bytes from S3');
    const blob = new Blob([arrayBuffer]);
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    console.log('Loaded', docs.length, 'pages from PDF');

    console.log('Splitting document file...');
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);

    console.log(`Creating embeddings for ${splitDocs.length} documents...`);
    await prisma.$transaction(async (tx) => {
      return await Promise.all(
        splitDocs.map(async (doc) => {
          const embedding = await getEmbedding(doc.pageContent);
          const embeddingString = `[${embedding.join(',')}]`;
          const row = await tx.document.create({
            data: {
              fileId: file.id,
              text: doc.pageContent,
            },
          });
          await tx.$executeRaw`
          UPDATE documents
          SET embedding = ${embeddingString}::vector
          WHERE id = ${row.id};
        `;
        })
      );
    });
  } catch (error) {
    console.error('Failed to create embeddings');
    throw error;
  }
}

async function search(
  text: string,
  gameId: number,
  n: number = 8
): Promise<string[]> {
  const embedding = await getEmbedding(text);
  const embeddingString = `[${embedding.join(',')}]`;
  const result = (await prisma.$queryRaw`
    SELECT text from documents
    LEFT JOIN files ON documents.file_id = files.id
    WHERE files.game_id = ${gameId}
    ORDER BY 1 - (embedding <=> ${embeddingString}::vector) DESC
    LIMIT ${n}
  `) as any[];
  return result.map((row) => row.text);
}

export { insertFile, search };
