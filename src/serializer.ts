import { Item, State } from "./App";

interface Intermediate {
  splitters: Array<string>;
  data: Array<Array<undefined | number | string>>;
  total: undefined | number;
  venmo: string;
  description: string;
}

function toIntermediate(state: State): Intermediate {
  const splitters = Array.from(state.splitters).sort();
  let data = [];

  for (let item of state.items) {
    let datum = [item.name, item.price];

    for (let splitter of splitters) {
      if (item.splitters.has(splitter)) {
        datum.push(1);
      } else {
        datum.push(0);
      }
    }
    data.push(datum);
  }

  return {
    splitters,
    data,
    total: state.total,
    venmo: state.venmo,
    description: state.description,
  };
}

function fromIntermediate(intermediate: Intermediate): State {
  let splittersSet = new Set(intermediate.splitters);

  let items: Array<Item> = [];

  for (let datum of intermediate.data) {
    let splits = datum.slice(2);
    items.push({
      name: datum[0] as string | undefined,
      price: datum[1] as number | undefined,
      splitters: new Set(
        intermediate.splitters.filter((_splitter, i) => splits[i] === 1)
      ),
    });
  }

  return {
    items,
    splitters: splittersSet,
    total: intermediate.total,
    venmo: intermediate.venmo,
    description: intermediate.description,
  };
}

export function toString(state: State): string {
  return btoa(JSON.stringify(toIntermediate(state)));
}

export function fromString(str: string): State {
  return fromIntermediate(JSON.parse(atob(str)));
}
