export function pickMinItem<T>(arr: T[], fn: (item: T) => number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr.reduce((minItem, item) => (fn(item) < fn(minItem) ? item : minItem));
}
