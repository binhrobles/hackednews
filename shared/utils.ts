import { DAY_MS, HOUR_MS, MINUTE_MS } from './consts';

// generator yielding every chunkSize elements
export function* chunker<T>(
  arr: T[],
  chunkSize: number = 25
): Generator<T[], void, unknown> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

export const getTimeDiffString = (time: number): string => {
  const timeDiff = new Date().getTime() - time * 1000;

  let value: number;
  let unit: string;
  switch (true) {
    case timeDiff < HOUR_MS:
      value = Math.floor(timeDiff / MINUTE_MS);
      unit = 'minute';
      break;
    case timeDiff < DAY_MS:
      value = Math.floor(timeDiff / HOUR_MS);
      unit = 'hour';
      break;
    default:
      value = Math.floor(timeDiff / DAY_MS);
      unit = 'day';
      break;
  }
  if (value > 1) unit += 's';

  return `${value} ${unit} ago`;
};

// check if a string is in the format of YYYY-MM
export const isYearMonth = (str: string): boolean =>
  /^\d{4}-\d{2}$/.test(str);

export const dateToYYYYMMDD = (date: Date): string =>
  date.toISOString().slice(0, 10).replace(/-/g, '');

export const dateToYearMonth = (date: Date): string =>
  date.toISOString().slice(0, 7);

export const monthToReadableString = (month: string): string =>
  new Date(month).toLocaleDateString(undefined, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
  });

export const dateToUnix = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
