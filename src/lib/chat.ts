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
    content: `You will be provided with a question and some retrieved context from a boardgame rulebook.
  Answer the question by providing quotes taken verbatim from the context, and a short summary of the answer.
  If you can't answer the question based on the context, just say that you don't know.
  Answer the question accurately, using only the provided pieces of context to answer the question.

  Use the format below when answering. The quotes must be verbatim from the retrieved pieces of context.
  Order the quotes in order of importance for answering the question.

  FORMATTING:
  Source(s):
  - <Quote 1>
  - <Quote 2>
  - ...

  Answer: <Your summarized answer>


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
