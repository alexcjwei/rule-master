import GameChatInterace from '@/components/game-chat-interface';
import UploadFileForm from '@/components/upload-file-form';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getObjectURLFromKey } from '@/lib/s3';

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
      <p>Title: {game?.title}</p>
      <p>Game Files:</p>
      <ul>
        {game?.files.map((file) => (
          <li key={file.id}>
            <a href={getObjectURLFromKey(file.key)} target='_blank'>
              {file.name}
            </a>
          </li>
        ))}
      </ul>
      {session?.user?.role === 'admin' && <UploadFileForm gameId={params.id} />}
      <GameChatInterace gameId={id} />
    </div>
  );
}
