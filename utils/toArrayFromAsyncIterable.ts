export async function toArrayFromAsyncIterable<T>(asyncIterable: AsyncIterable<T>): Promise<T[]> {
  const array: T[] = []
  for await (const it of asyncIterable) {
    array.push(it)
  }
  return array
}
