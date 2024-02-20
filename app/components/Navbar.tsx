import { Form, useSearchParams } from '@remix-run/react';
import { dateToYearMonth } from 'shared/utils';

export default function Navbar() {
  const [_, setSearchParams] = useSearchParams();

  return (
    <>
      {/* define form element we'll use to send query params to url */}
      <Form id="view-form" method="get" />

      <header className="navbar p-0">
        <div className="navbar-start">
          <button
            className="btn btn-ghost text-xl"
            onClick={() => setSearchParams(undefined)}
          >
            Hacked News
          </button>
        </div>

        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost text-xl">
              Feb 2024
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box shadow z-[1]"
            >
              <input
                className="input input-sm input-bordered"
                type="month"
                form="view-form"
                name="month"
                min="2020-01"
                max={dateToYearMonth(new Date())}
              />
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
