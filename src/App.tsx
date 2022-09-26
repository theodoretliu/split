import { useState, useCallback, useMemo, useEffect } from "react";
import produce, { enableMapSet } from "immer";
import { calculate } from "./calculate";
import { fromString, toString } from "./serializer";
import { Owage } from "./Owage";
enableMapSet();

export type Item = {
  name?: string;
  price?: number;
  splitters: Set<string>;
};

export type State = {
  items: Array<Item>;
  splitters: Set<string>;
  total?: number;
  venmo: string;
  description: string;
};

function App() {
  const [state, setState] = useState<State>(() => {
    const searchParams = new URL(document.location as any).searchParams;

    if (searchParams.has("q")) {
      try {
        return fromString(searchParams.get("q")!);
      } catch {}
    }

    return {
      items: [{ name: "", splitters: new Set() }],
      splitters: new Set([]),
      total: undefined,
      venmo: "",
      description: "",
    };
  });

  const setVenmo = useCallback(
    (venmo) =>
      setState(
        produce((state) => {
          state.venmo = venmo;
        })
      ),
    []
  );

  const setDescription = useCallback(
    (description) =>
      setState(
        produce((state) => {
          state.description = description;
        })
      ),
    []
  );

  const addSplitter = useCallback(
    (splitter) =>
      setState(
        produce((state) => {
          state.splitters.add(splitter);
        })
      ),
    [state.splitters]
  );

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
    window.history.replaceState(null, "", `/?q=${toString(state)}`);
  });

  const [addedName, setAddedName] = useState<string>("");

  return (
    <div className="App">
      <div>
        <label>Venmo Username</label>
        <input
          type="text"
          value={state.venmo}
          onChange={(e) => setVenmo(e.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={state.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Add Splitter</label>
        <input
          type="text"
          value={addedName}
          onChange={(e) => setAddedName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addSplitter(addedName);
              setAddedName("");
            }
          }}
        />
        <button
          tabIndex={-1}
          onClick={() => {
            addSplitter(addedName);
            setAddedName("");
          }}
        >
          Add Splitter
        </button>
      </div>

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
              <tr key={i}>
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
                    onKeyDown={(e) => {
                      if (
                        e.key === "Tab" &&
                        !e.shiftKey &&
                        i === state.items.length - 1
                      ) {
                        addItem();
                      }
                    }}
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
        <Owage
          key={splitter}
          name={splitter}
          amount={owage.owage[splitter]}
          venmo={state.venmo}
          description={state.description}
        />
      ))}
    </div>
  );
}

export default App;
