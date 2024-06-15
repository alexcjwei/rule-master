import { auth } from '@/lib/auth';

export async function NavBar() {
  const session = await auth();

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl'>RuleMaster</a>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          {session?.user ? (
            <li>
              <a href='/api/auth/signout'>Sign Out</a>
            </li>
          ) : (
            <li>
              <a href='/api/auth/signin'>Sign In</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
