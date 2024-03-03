import { useState } from 'react';
import { Form, useSearchParams } from '@remix-run/react';
import {
  dateToYearMonth,
  isYearMonth,
  monthToReadableString,
} from 'shared/utils';
import { Range } from 'shared/consts';

const LABEL_TODAY = 'Today';
const LABEL_WEEK = 'The Week';

const rangeToDisplay = (range: string, start: string) => {
  if (range === Range.TODAY) return LABEL_TODAY;
  if (range === Range.WEEK) return LABEL_WEEK;
  // TODO: Range.MONTH w/out start
  if (range === Range.MONTH && isYearMonth(start))
    return monthToReadableString(start);
  return 'Invalid Range';
};

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get('range') || Range.TODAY;
  const start = searchParams.get('start') || '';

  const [display, setDisplay] = useState(
    rangeToDisplay(range, start)
  );

  const handleRangeUpdate = (
    targetRange: Range,
    start: string = ''
  ) => {
    document
      .getElementById('month-dropdown')
      ?.removeAttribute('open');
    document
      .getElementById('navbar-dropdown')
      ?.removeAttribute('open');

    setDisplay(rangeToDisplay(targetRange, start));
    setSearchParams((prev) => {
      prev.set('range', targetRange);

      if (!start) prev.delete('start');
      if (start) prev.set('start', start);

      return prev;
    });
  };

  return (
    <>
      {/* define form element we'll use to send query params to url */}
      <Form id="view-form" method="get" />

      <header className="navbar p-0">
        <div className="navbar-start">
          <div className="btn btn-ghost text-lg">Hacked News</div>
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
                <div
                  className="btn btn-ghost"
                  onClick={() => {
                    handleRangeUpdate(Range.TODAY);
                  }}
                >
                  {LABEL_TODAY}
                </div>
              </li>
              <li>
                <div
                  className="btn btn-ghost"
                  onClick={() => {
                    handleRangeUpdate(Range.WEEK);
                  }}
                >
                  {LABEL_WEEK}
                </div>
              </li>
              <li>
                {/* TODO: this button doesn't receive hover events from under overlay */}
                <div className="btn btn-ghost ">A Month</div>
                <input
                  className="opacity-0 absolute w-full h-full left-0 top-0 box-border cursor-pointer cp:absolute cp:w-full cp:h-full"
                  type="month"
                  form="view-form"
                  name="month"
                  min="2012-01"
                  max={dateToYearMonth(new Date())}
                  onChange={(event) => {
                    handleRangeUpdate(
                      Range.MONTH,
                      event.target.value
                    );
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
