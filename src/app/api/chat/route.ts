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
    const possibleAnswer = await getChatCompletion([
      {
        role: Role.HUMAN,
        content: `Given the question about a board game, make up a possible answer. Be concise and keep your answer to less than 3 sentences.
        QUESTION:
      ${lastMessage.content}

      ANSWER:
      `,
      },
    ]);
    if (!possibleAnswer) {
      return errorMessage;
    }
    console.log(possibleAnswer);
    const context = await search(possibleAnswer, gameId, 5);

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
