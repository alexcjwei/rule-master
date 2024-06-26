import { getChatCompletion } from '@/lib/openai';
import {
  ChatMessage,
  Role,
  formatPromptInTemplate,
  insertSystemMessage,
} from '@/lib/chat';
import { search } from '@/lib/vectorstore';

export async function POST(request: Request) {
  const body = await request.json();
  const chatHistory = body.chatHistory as ChatMessage[];
  const gameId = body.gameId as number;
  const errorMessage = Response.json({
    role: Role.AI,
    content: 'An error occurred generating a response. Please try again.',
  });

  // Get RAG results
  const lastMessage = chatHistory.pop() as ChatMessage; // Remove last message so we can format it
  try {
    const context = await search(lastMessage.content, gameId, 5);

    // Format the prompt using the template
    const formattedPrompt = formatPromptInTemplate(
      lastMessage.content,
      context
    );
    chatHistory.push(formattedPrompt);
    const formattedChatHistory = insertSystemMessage(chatHistory);

    const chatCompletion = await getChatCompletion(formattedChatHistory);
    console.log(formattedChatHistory, chatCompletion);
    return Response.json({ role: Role.AI, content: chatCompletion });
  } catch (error) {
    console.error(error);
    return errorMessage;
  }
}
