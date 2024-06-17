import UploadFileForm from '@/components/upload-file-form';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function GameDetail({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const id = Number(params.id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  const game = await prisma.game.findUnique({
    where: { id },
    include: { files: true },
  });
  return (
    <div>
      <p>My Game: {game?.title}</p>
      <p>Game Files:</p>
      {game?.files.map((file) => (
        <div key={file.id}>{file.name}</div>
      ))}
      {session?.user?.role == 'admin' && <UploadFileForm gameId={params.id} />}
    </div>
  );
}
