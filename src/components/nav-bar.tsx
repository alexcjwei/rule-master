export function NavBar() {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl'>RuleMaster</a>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <a>Sign In</a>
          </li>
          <li>
            <a>Sign Out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
