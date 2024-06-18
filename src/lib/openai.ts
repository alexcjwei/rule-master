import OpenAI from 'openai';
import { ChatMessage } from '@/lib/chat';

let openai: OpenAI;

declare global {
  var openai: OpenAI;
}

if (process.env.NODE_ENV === 'production') {
  openai = new OpenAI();
} else {
  if (!global.openai) {
    global.openai = new OpenAI();
  }
  openai = global.openai;
}

async function getChatCompletion(
  messages: ChatMessage[],
  model: string = 'gpt-3.5-turbo-0125'
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: model,
  });
  return chatCompletion.choices[0].message.content;
}

async function getEmbedding(
  text: string,
  model: string = 'text-embedding-3-small'
) {
  text = text.replace('\n', ' ');
  const response = await openai.embeddings.create({
    input: text,
    model: model,
  });
  return response.data[0].embedding;
}

export { getChatCompletion, getEmbedding };
