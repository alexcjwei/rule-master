import { getChatCompletion } from '@/lib/openai';
import { Role } from '@/lib/chat';
import { search } from '@/lib/vectorstore';

export async function POST(request: Request) {
  const body = await request.json();
  const searchResults = await search(
    body.chatHistory[body.chatHistory.length - 1].content,
    body.gameId,
    5
  );

  const chatCompletion = await getChatCompletion(body.chatHistory);

  return Response.json({ role: Role.AI, content: chatCompletion });
}
