'use client';
import { useState } from 'react';
import { type ChatMessage, Role } from '@/lib/chat';

function ChatMessageItem(props: { message: ChatMessage }) {
  const isHuman = props.message.role == Role.HUMAN;
  return (
    <div className={`chat ${isHuman ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar placeholder'>
        <div className='bg-neutral text-neutral-content rounded-full w-10'>
          <span className='text-md'>{isHuman ? 'You' : 'AI'}</span>
        </div>
      </div>
      <div className='chat-bubble'>
        <p>{props.message.content}</p>
      </div>
    </div>
  );
}

export default function GameChatInterace(props: { gameId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      const newMessages = [
        ...messages,
        { role: Role.HUMAN, content: inputValue },
      ];
      setMessages(newMessages);
      setInputValue('');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId: props.gameId,
            chatHistory: newMessages,
          }),
        });
        const chatCompletion = (await res.json()) as ChatMessage;
        setMessages([...newMessages, chatCompletion]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className='flex flex-col text-sm'>
      <div className='mx-8'>
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}
        <form
          onSubmit={handleSubmit}
          className='form-control flex-row justify-center items-center pt-2'
        >
          <input
            type='text'
            placeholder='Message RuleMaster'
            value={inputValue}
            onChange={handleInputChange}
            className='input input-bordered flex-grow'
          />
          <button type='submit' className='btn ml-2' disabled={!inputValue}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
