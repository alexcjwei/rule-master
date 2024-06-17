import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function GamesList() {
  const games = await prisma.game.findMany();

  return (
    <div>
      <p>Games:</p>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>{game.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
