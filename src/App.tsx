import { useState, useCallback, useMemo, useEffect } from "react";
import produce, { enableMapSet } from "immer";
import { calculate } from "./calculate";
enableMapSet();

export type Item = {
  name?: string;
  price?: number;
  splitters: Set<string>;
};

type State = {
  items: Array<Item>;
  splitters: Set<string>;
  total?: number;
};

function App() {
  const [state, setState] = useState<State>(() => {
    const searchParams = new URL(document.location as any).searchParams;

    if (searchParams.has("q")) {
      try {
        const params = JSON.parse(atob(searchParams.get("q")!));

        return {
          items: params.items.map((item: any) => {
            return {
              ...item,
              splitters: new Set(
                Object.entries(item.splitters).map(([key, _]) => key)
              ),
            };
          }),
          splitters: new Set(params.splitters),
          total: params.total,
        };
      } catch {}
    }

    return {
      items: [],
      splitters: new Set(["Teddy", "Amol", "Nenya"]),
      total: undefined,
    };
  });

  const addItem = useCallback(
    () =>
      setState(
        produce((state) => {
          state.items.push({ splitters: new Set() });
        })
      ),
    [state.splitters]
  );

  const changeItemName = useCallback(
    (i, name) =>
      setState(
        produce((state) => {
          state.items[i].name = name;
        })
      ),
    []
  );

  const changeItemPrice = useCallback(
    (i, price) =>
      setState(
        produce((state) => {
          state.items[i].price = price;
        })
      ),
    []
  );

  const toggleItemName = useCallback(
    (i, splitter) =>
      setState(
        produce((state) => {
          if (state.items[i].splitters.has(splitter)) {
            state.items[i].splitters.delete(splitter);
          } else {
            state.items[i].splitters.add(splitter);
          }
        })
      ),
    []
  );

  const sortedSplitters = useMemo<Array<string>>(
    () => [...state.splitters].sort(),
    [state.splitters]
  );

  const owage = calculate(state.items, sortedSplitters, state.total || 0);

  useEffect(() => {
    const mappedItems = JSON.stringify({
      items: state.items.map((item) => {
        const mappedSplitters: { [key: string]: true } = {};

        for (const splitter of item.splitters) {
          mappedSplitters[splitter] = true;
        }

        return {
          ...item,
          splitters: mappedSplitters,
        };
      }),
      splitters: sortedSplitters,
      total: state.total,
    });

    if (btoa(mappedItems).length > 2048) {
      alert("hello");
    }

    window.history.replaceState(null, "", `/?q=${btoa(mappedItems)}`);
  });

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Item Name</th>

            <th>Price</th>

            {sortedSplitters.map((splitter) => (
              <th>{splitter}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.items.map((item, i) => {
            return (
              <tr>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => changeItemName(i, e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      changeItemPrice(i, parseFloat(e.target.value))
                    }
                  />
                </td>

                {sortedSplitters.map((splitter) => {
                  return (
                    <td
                      style={{
                        width: "24px",
                        backgroundColor: item.splitters.has(splitter)
                          ? "black"
                          : "",
                        border: "1px solid blue",
                      }}
                      onClick={() => toggleItemName(i, splitter)}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td>Subtotal</td>
            <td>{owage.subtotal.toFixed(2)}</td>

            {sortedSplitters.map((splitter) => (
              <td>{owage.subtotals[splitter].toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <button onClick={addItem}>Add Item</button>

      <div>
        <span>Total: </span>
        <input
          type="number"
          value={state.total}
          onChange={(e) =>
            setState(
              produce((state) => {
                state.total = parseFloat(e.target.value);
              })
            )
          }
        />
      </div>

      {sortedSplitters.map((splitter) => (
        <div>
          <span>{splitter} owes: </span>
          <span>{owage.owage[splitter].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default App;
