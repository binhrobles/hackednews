import { useState } from 'react';
import { Form, useSearchParams } from '@remix-run/react';
import { dateToYearMonth, monthToReadableString } from 'shared/utils';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const month = searchParams.get('month');

  const [display, setDisplay] = useState(
    month && month.length > 0 ? monthToReadableString(month) : 'Today'
  );

  return (
    <>
      {/* define form element we'll use to send query params to url */}
      <Form id="view-form" method="get" />

      <header className="navbar p-0">
        <div className="navbar-start">
          <button
            className="btn btn-ghost text-xl"
            onClick={() => {
              document
                .getElementById('month-dropdown')
                ?.removeAttribute('open');
              setDisplay('Today');
              setSearchParams(undefined);
            }}
          >
            Hacked News
          </button>
        </div>

        <div className="navbar-end">
          <div className="relative inline-block">
            <span className="btn btn-ghost pointer-events-none text-xl">
              {display}
            </span>
            <input
              className="opacity-0 absolute w-full h-full left-0 top-0 box-border cursor-pointer cp:absolute cp:w-full cp:h-full"
              type="month"
              form="view-form"
              name="month"
              min="2012-01"
              max={dateToYearMonth(new Date())}
              onChange={(event) => {
                document
                  .getElementById('month-dropdown')
                  ?.removeAttribute('open');
                setDisplay(monthToReadableString(event.target.value));
                setSearchParams((prev) => {
                  prev.set('month', event.target.value);
                  return prev;
                });
              }}
            />
          </div>
        </div>
      </header>
    </>
  );
}
