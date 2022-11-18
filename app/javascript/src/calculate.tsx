import { Item, ValidatedItem } from "src/stores/SplitStore";

import { Option } from "src/option";

export function calculate(
  items: Array<ValidatedItem>,
  splitters: Array<string>,
  total: number
): Option<{
  subtotal: number;
  subtotals: { [splitter: string]: number };
  owage: { [splitter: string]: number };
}> {
  for (const item of items) {
    if (!item.valid) {
      return { type: "None" };
    }
  }

  const owage: { [splitter: string]: number } = {};

  let subtotal = 0;

  for (const splitter of splitters) {
    owage[splitter] = 0;
  }

  for (const item of items) {
    if (item.splitters.size === 0 || isNaN(Number(item.unparsedPrice))) {
      continue;
    }

    const price = Number(item.unparsedPrice);

    subtotal += price;
    for (const splitter of item.splitters) {
      owage[splitter] += price / item.splitters.size;
    }
  }

  const multiplier = total / subtotal;

  const subtotals = { ...owage };

  for (const key in owage) {
    owage[key] *= multiplier;
  }

  return {
    type: "Some",
    value: {
      subtotal,
      subtotals,
      owage,
    },
  };
}
