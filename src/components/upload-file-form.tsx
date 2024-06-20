'use client';
import { useState } from 'react';
import { revalidatePath } from 'next/cache';

export default function UploadFileForm(props: { gameId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('gameId', props.gameId);

      try {
        await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        revalidatePath(`/games/${props.gameId}`);
      } catch (error) {
        console.error('Failed to upload file', error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType='multipart/form-data'
      className='form-control'
    >
      <h2 className='text-l'>Upload New File</h2>
      <input type='hidden' name='gameId' value={props.gameId} />
      <input
        type='file'
        name='file'
        accept='.pdf'
        onChange={handleFileChange}
        className='file-input'
      />
      <button type='submit' disabled={!selectedFile} className='btn'>
        Upload
      </button>
    </form>
  );
}
