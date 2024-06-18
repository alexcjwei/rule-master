import { getChatCompletion } from '@/lib/openai';
import { Role } from '@/lib/chat';

export async function POST(request: Request) {
  const body = await request.json();
  const chatCompletion = await getChatCompletion(body.chatHistory);

  return Response.json({ role: Role.AI, content: chatCompletion });
}
