import FilesTable from '@/components/files-table';
import GameChatInterace from '@/components/game-chat-interface';
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

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div>
      <h1 className='text-xl'>{game.title}</h1>
      {session?.user?.role === 'admin' && <UploadFileForm gameId={params.id} />}
      <FilesTable files={game?.files} />
      <GameChatInterace gameId={id} />
    </div>
  );
}
