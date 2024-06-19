'use client';
import { useFormStatus } from 'react-dom';
import { createGame } from '@/actions';

export default function AddGameForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createGame}>
      <input
        type='text'
        placeholder='Enter game title'
        id='title'
        name='title'
        className='input'
      />
      <button type='submit' disabled={pending} className='btn'>
        {pending ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
