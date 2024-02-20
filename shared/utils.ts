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
    case timeDiff < 1000 * 60 * 60:
      value = Math.floor(timeDiff / (1000 * 60));
      unit = 'minute';
      break;
    case timeDiff < 1000 * 60 * 60 * 24:
      value = Math.floor(timeDiff / (1000 * 60 * 60));
      unit = 'hour';
      break;
    default:
      value = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      unit = 'day';
      break;
  }
  if (value > 1) unit += 's';

  return `${value} ${unit} ago`;
};
