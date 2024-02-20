// generator yielding every chunkSize elements
export function* chunker<T>(
  arr: T[],
  chunkSize: number = 25
): Generator<T[], void, unknown> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}
