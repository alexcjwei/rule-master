import { auth } from '@/lib/auth';

export async function NavBar() {
  const session = await auth();

  const items = (
    <li>
      <details>
        <summary>Browse</summary>
        <ul className='p-2'>
          <li>
            <a>Games</a>
          </li>
        </ul>
      </details>
    </li>
  );

  return (
    <div className='navbar bg-base-300'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
          >
            {items}
          </ul>
        </div>
        <a className='btn btn-ghost text-xl' href='/landing'>
          RuleMaster
        </a>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>{items}</ul>
      </div>
      <div className='navbar-end'>
        {session?.user ? (
          <a className='btn' href='/api/auth/signout'>
            Sign Out
          </a>
        ) : (
          <a className='btn' href='api/auth/signin'>
            Sign In
          </a>
        )}
      </div>
    </div>
  );
}
