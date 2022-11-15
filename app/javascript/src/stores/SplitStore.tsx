import {
  action,
  comparer,
  computed,
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
  id: string;
  venmo: string = "";
  description: string = "";
  items: Array<Item> = [{ name: "", splitters: new Set() }];
  splitters: Set<string> = new Set();
  total: number = 0;
  dirty: boolean = false;

  updateDisposer?: () => void;

  constructor(id: string) {
    makeAutoObservable(this);
    this.id = id;
  }

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

  fetchSplit = async () => {
    const response = await fetch(`/api/splits/${this.id}`);
    const json = await response.json();

    runInAction(() => {
      const { venmo, description, total, items, splitters } = json.data;
      this.venmo = venmo ?? "";
      this.total = total ?? 0;
      this.description = description ?? "";
      if (items && items.length > 0) {
        this.items = items.map(
          (item: {
            name: string;
            price?: number;
            splitters: Array<string>;
          }) => ({
            ...item,
            splitters: new Set(item.splitters),
          })
        );
      } else {
        this.items = [{ name: "", splitters: new Set() }];
      }
      this.splitters = new Set(splitters ?? []);
    });
  };

  updateSplit = async () => {
    await fetch(`/api/splits/${this.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          venmo: this.venmo,
          description: this.description,
          splitters: Array.from(this.splitters),
          items: this.sendableItems,
          total: this.total,
        },
      }),
    });
    this.dirty = false;
  };

  reactToUpdates = () => {
    this.updateDisposer = reaction(
      () => ({
        venmo: this.venmo,
        description: this.description,
        items: this.sendableItems,
        splitters: Array.from(this.splitters),
        total: this.total,
      }),
      debounce((value) => {
        console.log(value);
        this.updateSplit();
      }, 1000),
      { equals: comparer.structural }
    );
  };

  @action dispose = () => {
    this.updateDisposer?.();
    this.updateDisposer = undefined;
  };

  @action setVenmo = (venmo: string) => {
    this.venmo = venmo;
    this.dirty = true;
  };

  @action setDescription = (description: string) => {
    this.description = description;
    this.dirty = true;
  };

  @action addSplitter = (name: string) => {
    this.splitters.add(name);
    this.dirty = true;
  };

  @action removeSplitter = (name: string) => {
    this.splitters.delete(name);
    this.dirty = true;
  };

  @action addItem = () => {
    this.items.push({ name: "", splitters: new Set() });
    this.dirty = true;
  };

  @action removeItem = (i: number) => {
    if (i >= 0 && i < this.items.length) {
      this.items.splice(i, 1);
    }
    this.dirty = true;
  };

  @action editItemName = (i: number, name: string) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].name = name;
    }
    this.dirty = true;
  };

  @action editItemPrice = (i: number, price: number | undefined) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].price = price;
    }
    this.dirty = true;
  };

  @action toggleSplitterOnItem = (i: number, name: string) => {
    if (i >= 0 && i < this.items.length && this.splitters.has(name)) {
      if (this.items[i].splitters.has(name)) {
        this.items[i].splitters.delete(name);
      } else {
        this.items[i].splitters.add(name);
      }
    }
    this.dirty = true;
  };

  @action addSplitterToItem = (i: number, name: string) => {
    if (i >= 0 && i < this.items.length && this.splitters.has(name)) {
      this.items[i].splitters.add(name);
    }
    this.dirty = true;
  };

  @action removeSplitterFromItem = (i: number, name: string) => {
    if (i >= 0 && i < this.items.length) {
      this.items[i].splitters.delete(name);
    }
    this.dirty = true;
  };

  @action setTotal = (total: number) => {
    this.total = total;
    this.dirty = true;
  };
}
