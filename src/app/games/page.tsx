import prisma from '@/lib/prisma';

export default async function GamesPage() {
  const games = await prisma.game.findMany();

  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul>
    </div>
  );
}
