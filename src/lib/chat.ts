enum Role {
  HUMAN = 'user',
  AI = 'assistant',
}

interface ChatMessage {
  role: Role;
  content: string;
}
export { type ChatMessage, Role };
