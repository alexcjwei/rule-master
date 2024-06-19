import { Game } from '@prisma/client';
import Link from 'next/link';

function GameRow({ game }: { game: Game }) {
  return (
    <tr>
      <th>
        <Link href={`/games/${game.id}`}>{game.title}</Link>
      </th>
      <td>{game.createdAt.toLocaleDateString()}</td>
      <td>{game.updatedAt.toLocaleTimeString()}</td>
    </tr>
  );
}

export default function GamesTable({ games }: { games: Game[] }) {
  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
