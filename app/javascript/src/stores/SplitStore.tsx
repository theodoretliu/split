import {
  action,
  comparer,
  computed,
  IReactionDisposer,
  makeAutoObservable,
  reaction,
  runInAction,
} from "mobx";
import { debounce } from "lodash";
import { calculate } from "src/calculate";

export type Item = {
  name: string;
  price?: number;
  splitters: Set<string>;
};

export class SplitStore {
  splits: Split[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchSplit = async (id: string) => {
    const response = await fetch(`/splits/${id}.json`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();

    runInAction(() => {
      const split = new Split(this);
      split.updateFromJson(json.id, json.data, json.read_only);
      this.splits.push(split);
    });
  };

  updateSplit = async (split: Split) => {
    await fetch(`/splits/${split.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: split.asJSON,
      }),
    });
  };

  getSplit = (id: string) => {
    return this.splits.find((split) => split.id === id);
  };
}

export class Split {
  id: string = "";
  venmo: string = "";
  description: string = "";
  items: Array<Item> = [{ name: "", splitters: new Set() }];
  splitters: Set<string> = new Set();
  total: number = 0;
  store: SplitStore;
  readOnly: boolean = true;
  dirty: boolean = false;

  saveHandler: IReactionDisposer;

  constructor(store: SplitStore) {
    makeAutoObservable(this, { store: false });
    this.store = store;

    this.saveHandler = reaction(
      () => this.asJSON,
      debounce(
        action(async (value) => {
          await this.store.updateSplit(this);
          runInAction(() => {
            this.dirty = false;
          });
        }),
        1000
      ),
      { equals: comparer.structural }
    );
  }

  dispose = () => {
    this.saveHandler();
  };

  updateFromJson = (
    id: string,
    {
      venmo,
      total,
      description,
      items,
      splitters,
    }: {
      venmo?: string;
      total?: number;
      description?: string;
      items: { name: string; price?: number; splitters: Array<string> }[];
      splitters: string[];
    },
    read_only: boolean | undefined
  ) => {
    this.id = id ?? "";
    this.venmo = venmo ?? "";
    this.total = total ?? 0;
    this.description = description ?? "";
    this.readOnly  = read_only ?? true;

    if (items && items.length > 0) {
      this.items = items.map((item) => ({
        ...item,
        splitters: new Set(item.splitters),
      }));
    } else {
      this.items = [{ name: "", splitters: new Set() }];
    }
    this.splitters = new Set(splitters ?? []);
  };

  @computed get sortedSplitters() {
    return Array.from(this.splitters).slice().sort();
  }

  @computed get owage() {
    return calculate(this.items, this.sortedSplitters, this.total || 0);
  }

  @computed get sendableItems() {
    return this.items.map((item) => ({
      ...item,
      splitters: Array.from(item.splitters),
    }));
  }

  get asJSON() {
    return {
      venmo: this.venmo,
      description: this.description,
      splitters: Array.from(this.splitters),
      items: this.sendableItems,
      total: this.total,
    };
  }

  createSetField = <T extends any[],>(f: (...args: T) => void) => action((...args: T) => {
    if (this.readOnly) {
      return;
    }

    f(...args);
    this.dirty = true;
  })

  @action setVenmo = this.createSetField((venmo: string) => {
    this.venmo = venmo;
  });

  @action setDescription = this.createSetField((description: string) => {
    this.description = description;
  });

  @action addSplitter = this.createSetField((name: string) => {
    this.splitters.add(name);
  });

  @action removeSplitter = this.createSetField((name: string) => {
    this.splitters.delete(name);
  });

  @action addItem = this.createSetField(() => {
    this.items.push({ name: "", splitters: new Set() });
  });

  @action removeItem = this.createSetField((i: number) => {
    if (i >= 0 && i < this.items.length) {
      this.items.splice(i, 1);
    }
  });

  @action editItemName = this.createSetField((i: number, name: string) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].name = name;
    }
  });

  @action editItemPrice = this.createSetField((i: number, price: number | undefined) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].price = price;
    }
  });

  @action toggleSplitterOnItem = this.createSetField((i: number, name: string) => {
    if (i >= 0 && i < this.items.length && this.splitters.has(name)) {
      if (this.items[i].splitters.has(name)) {
        this.items[i].splitters.delete(name);
      } else {
        this.items[i].splitters.add(name);
      }
    }
  });

  @action addSplitterToItem = this.createSetField((i: number, name: string) => {
    if (i >= 0 && i < this.items.length && this.splitters.has(name)) {
      this.items[i].splitters.add(name);
    }
  });

  @action removeSplitterFromItem = this.createSetField((i: number, name: string) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].splitters.delete(name);
    }
  });

  @action setTotal = this.createSetField((total: number) => {
    this.total = total;
  });
}

export const store = new SplitStore();
