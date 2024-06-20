'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadFileForm(props: { gameId: string }) {
  const router = useRouter();
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
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('File uploaded successfully');
          router.refresh();
        } else {
          console.error('Failed to upload file');
        }
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
      <input
        type='file'
        name='file'
        accept='.pdf'
        onChange={handleFileChange}
        className='file-input'
      />
      <button
        type='submit'
        disabled={!selectedFile}
        className='btn max-w-[200px]'
      >
        Upload
      </button>
    </form>
  );
}
