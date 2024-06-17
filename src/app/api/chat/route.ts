import { getChatCompletion } from '@/lib/openai';
import { Role } from '@/lib/chat';
import vectorStore from '@/lib/vectorstore';

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body.gameId);
  const chatCompletion = await getChatCompletion(body.chatHistory);

  const similarity = await vectorStore.similaritySearch('Hello, world', 1);
  console.log(similarity);
  return Response.json({ role: Role.AI, content: chatCompletion });
}
