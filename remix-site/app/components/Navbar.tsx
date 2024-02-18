import { Form } from '@remix-run/react';

const NavBarLineItems = () =>
  ['new', 'ask', 'show', 'jobs'].map((link) => (
    <button
      key={link}
      className="btn btn-sm"
      form="view-form"
      name="view"
      value={link}
    >
      {link}
    </button>
  ));

export default function Navbar() {
  return (
    <>
      {/* define form element we'll use to send query params to url */}
      <Form id="view-form" method="get" />

      <header className="navbar p-0">
        <div className="navbar-start">
          <button
            form="view-form"
            name="view"
            value="home"
            className="btn btn-ghost text-xl"
          >
            Hacked News
          </button>
        </div>

        <div className="navbar-end">
          <div className="hidden sm:flex">
            {/* standard navbar menu */}
            <ul className="menu menu-horizontal">
              <NavBarLineItems />
            </ul>
          </div>

          {/* mobile navbar menu */}
          <div className="dropdown dropdown-end sm:hidden">
            <div tabIndex={0} className="btn ghost rounded-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box shadow z-[1]"
            >
              <NavBarLineItems />
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
