import AddGameForm from '@/components/add-game-form';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import GamesTable from '@/components/games-table';

export default async function GamesList() {
  const session = await auth();
  const games = await prisma.game.findMany();

  return (
    <div>
      {session?.user?.role === 'admin' && <AddGameForm />}
      <GamesTable games={games} />
    </div>
  );
}
