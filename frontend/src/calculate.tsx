import { Item } from "./App";

export function calculate(
  items: Array<Item>,
  splitters: Array<string>,
  total: number
) {
  const owage: { [splitter: string]: number } = {};
  let subtotal = 0;

  for (const splitter of splitters) {
    owage[splitter] = 0;
  }

  for (const item of items) {
    if (item.splitters.size === 0 || item.price === undefined) {
      continue;
    }

    subtotal += item.price;
    for (const splitter of item.splitters) {
      owage[splitter] += item.price / item.splitters.size;
    }
  }

  const multiplier = total / subtotal;

  const subtotals = { ...owage };

  for (const key in owage) {
    owage[key] *= multiplier;
  }

  return {
    subtotal,
    subtotals,
    owage,
  };
}
