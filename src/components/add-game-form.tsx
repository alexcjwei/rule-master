'use client';
import { useFormStatus } from 'react-dom';
import { createGame } from '@/actions';

export default function AddGameForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createGame}>
      <h2>Add Game</h2>
      <label htmlFor='title'>Title</label>
      <input type='text' id='title' name='title' />
      <button type='submit' disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
