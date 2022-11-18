interface Some<T> {
  type: "Some";
  value: T;
}

interface None {
  type: "None";
}

export type Option<T> = Some<T> | None;
