import { auth } from '@/lib/auth';
export default async function Home() {
  return (
    <div>
      <h1 className='text-xl'>Welcome to RuleMaster</h1>
      <p>
        RuleMaster is your ultimate destination for board game rules and Q&A.
      </p>
      <p>
        Explore our collection of board games and their rulebooks, and get your
        questions answered by our Rule Answering Guru (RAG) system.
      </p>
    </div>
  );
}
