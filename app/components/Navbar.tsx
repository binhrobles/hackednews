import { useState } from 'react';
import { Form, useSearchParams } from '@remix-run/react';
import {
  dateToYearMonth,
  isYearMonth,
  monthToReadableString,
} from 'shared/utils';

const RANGE_TODAY = 'today';
const RANGE_WEEK = 'week';

const rangeToDisplay = (range: string) => {
  if (range === RANGE_TODAY) return 'Today';
  if (range === RANGE_WEEK) return 'This Week';
  if (isYearMonth(range)) return monthToReadableString(range);
  return 'Invalid Range';
};

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get('range');

  const [display, setDisplay] = useState(
    range && range.length > 0 ? rangeToDisplay(range) : 'Today'
  );

  const handleRangeUpdate = (targetRange: string) => {
    document
      .getElementById('month-dropdown')
      ?.removeAttribute('open');
    document
      .getElementById('navbar-dropdown')
      ?.removeAttribute('open');
    setDisplay(rangeToDisplay(targetRange));
    setSearchParams((prev) => {
      prev.set('range', targetRange);
      return prev;
    });
  };

  return (
    <>
      {/* define form element we'll use to send query params to url */}
      <Form id="view-form" method="get" />

      <header className="navbar p-0">
        <div className="navbar-start">
          <button
            className="btn btn-ghost text-lg"
            onClick={() => {
              handleRangeUpdate(RANGE_TODAY);
            }}
          >
            Hacked News
          </button>
        </div>

        <div className="navbar-end">
          <span className="invisible sm:visible">
            Top Stories from
          </span>
          <details
            id="navbar-dropdown"
            className="dropdown dropdown-end"
          >
            <summary className="btn btn-ghost text-lg flex-nowrap">
              {display}
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m8 10 4 4 4-4"
                />
              </svg>
            </summary>
            <ul className="shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <div className="btn btn-ghost">A Month</div>
                <input
                  className="opacity-0 absolute w-full h-full left-0 top-0 box-border cursor-pointer cp:absolute cp:w-full cp:h-full"
                  type="month"
                  form="view-form"
                  name="month"
                  min="2012-01"
                  max={dateToYearMonth(new Date())}
                  onChange={(event) => {
                    handleRangeUpdate(event.target.value);
                  }}
                />
              </li>
            </ul>
          </details>
        </div>
      </header>
    </>
  );
}
