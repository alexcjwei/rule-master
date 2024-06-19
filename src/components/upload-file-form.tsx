'use client';
import { uploadFile } from '@/actions';
import { useFormStatus } from 'react-dom';

export default function UploadFileForm(props: { gameId: string }) {
  const { pending } = useFormStatus();

  return (
    <form action={uploadFile}>
      <input type='hidden' name='gameId' value={props.gameId} />
      <input type='file' name='file' accept='.pdf' />
      <button disabled={pending} type='submit' className='btn'>
        {!!pending ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
