import { useState } from 'react';
import { Form, useSearchParams } from '@remix-run/react';
import { dateToYearMonth, monthToReadableString } from 'shared/utils';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const month = searchParams.get('month');

  const [display, setDisplay] = useState(
    month ? monthToReadableString(month) : 'Today'
  );

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
          <details
            id="month-dropdown"
            className="dropdown dropdown-end"
          >
            <summary className="btn btn-ghost text-xl">
              {display}
            </summary>
            <div className="dropdown-content bg-base-100 rounded-box shadow z-[1]">
              <input
                className="input input-sm input-bordered"
                type="month"
                form="view-form"
                name="month"
                min="2012-01"
                max={dateToYearMonth(new Date())}
                onChange={(event) => {
                  document
                    .getElementById('month-dropdown')
                    ?.removeAttribute('open');
                  setDisplay(
                    monthToReadableString(event.target.value)
                  );
                  setSearchParams((prev) => {
                    prev.set('month', event.target.value);
                    return prev;
                  });
                }}
              />
            </div>
          </details>
        </div>
      </header>
    </>
  );
}
