import { auth } from '@/lib/auth';
export default async function Home() {
  const session = await auth();
  return <div>Hello, {session?.user ? session?.user.name : 'World'}!</div>;
}
