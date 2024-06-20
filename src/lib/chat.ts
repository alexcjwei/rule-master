enum Role {
  HUMAN = 'user',
  AI = 'assistant',
  SYSTEM = 'system',
}

interface ChatMessage {
  role: Role;
  content: string;
}

function formatPromptInTemplate(
  prompt: string,
  context: string[]
): ChatMessage {
  return {
    role: Role.HUMAN,
    content: `Use the following pieces of retrieved context to answer the question.
  If you don't know the answer, just say that you don't know. 
  Reference the context in your answer. Answer the question thoroughly and concisely.

  QUESTION:
  ${prompt}

  CONTEXT:
  ${context.join('\n')}

  ANSWER:
  `,
  };
}

const systemPrompt = {
  role: Role.SYSTEM,
  content: `You are a helpful assistant knowledgeable about board games.
You are helpful because you concisely answer questions about board games given retrieved
context from the board game rulebooks.
`,
};

function insertSystemMessage(
  messages: ChatMessage[],
  systemMessage: ChatMessage = systemPrompt
): ChatMessage[] {
  return [systemMessage, ...messages];
}

export { type ChatMessage, Role, formatPromptInTemplate, insertSystemMessage };
