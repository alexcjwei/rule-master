'use client';
export function TriggerEmbedding({ fileId }: { fileId: number }) {
  const handleClick = async () => {
    try {
      console.log('Deleting embeddings...');
      await fetch(`/api/embeddings/files/${fileId}`, {
        method: 'DELETE',
      });
      console.log('Creating embeddings...');
      await fetch(`/api/embeddings/files/${fileId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to embed');
    }
  };
  return (
    <button className='btn btn-sm' onClick={handleClick}>
      Refresh embeddings
    </button>
  );
}
