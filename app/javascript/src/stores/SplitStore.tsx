import { makeAutoObservable } from "mobx";

export class SplitStore {
  id: string;

  constructor(id: string) {
    makeAutoObservable(this);
    this.id = id;
  }
}
