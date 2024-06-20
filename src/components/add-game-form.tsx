'use client';
import { useFormStatus } from 'react-dom';
import { createGame } from '@/actions';

export default function AddGameForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createGame} className='form-control'>
      <h2 className='text-xl'>Add New Game</h2>
      <input
        type='text'
        placeholder='Enter game title'
        id='title'
        name='title'
        className='input'
      />
      <button type='submit' disabled={pending} className='btn max-w-[200px]'>
        {pending ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
