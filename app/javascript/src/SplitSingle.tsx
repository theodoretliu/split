import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { Item, SplitStore } from "src/stores/SplitStore";
import { Owage } from "src/Owage";

interface SplitSingleImplProps {
  store: {
    venmo: string;
    description: string;
    splitters: Set<string>;
    items: Array<Item>;
    total: number;

    sortedSplitters: Array<string>;
    owage: {
      subtotal: number;
      subtotals: Record<string, number>;
      owage: Record<string, number>;
    };

    setVenmo: (venmo: string) => void;
    setDescription: (description: string) => void;
    addSplitter: (name: string) => void;
    removeSplitter: (name: string) => void;
    addItem: () => void;
    editItemName: (i: number, name: string) => void;
    editItemPrice: (i: number, price: number | undefined) => void;
    toggleSplitterOnItem: (i: number, name: string) => void;
    removeItem: (i: number) => void;
    setTotal: (total: number) => void;

    dirty: boolean;
  };
}

export const SplitSingleImpl = observer(({ store }: SplitSingleImplProps) => {
  const [addedName, setAddedName] = useState("");

  return (
    <div className="App">
      <div>
        <label>Venmo Username</label>
        <input
          type="text"
          value={store.venmo}
          onChange={(e) => store.setVenmo(e.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={store.description}
          onChange={(e) => store.setDescription(e.target.value)}
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
              store.addSplitter(addedName);
              setAddedName("");
            }
          }}
        />
        <button
          tabIndex={-1}
          onClick={() => {
            store.addSplitter(addedName);
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

            {store.sortedSplitters.map((splitter) => (
              <th key={splitter}>{splitter}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {store.items.map((item, i) => {
            return (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => store.editItemName(i, e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.price ?? ""}
                    onChange={(e) =>
                      store.editItemPrice(i, parseFloat(e.target.value))
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Tab" &&
                        !e.shiftKey &&
                        i === store.items.length - 1
                      ) {
                        store.addItem();
                      }
                    }}
                  />
                </td>

                {store.sortedSplitters.map((splitter) => {
                  return (
                    <td
                      style={{
                        width: "24px",
                        backgroundColor: item.splitters.has(splitter)
                          ? "black"
                          : "",
                        border: "1px solid blue",
                      }}
                      onClick={() => store.toggleSplitterOnItem(i, splitter)}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td>Subtotal</td>
            <td>{store.owage.subtotal.toFixed(2)}</td>

            {store.sortedSplitters.map((splitter) => (
              <td>{store.owage.subtotals[splitter].toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <button onClick={() => store.addItem()}>Add Item</button>

      <div>
        <span>Total: </span>
        <input
          type="number"
          value={store.total}
          onChange={(e) => store.setTotal(parseFloat(e.target.value))}
        />
      </div>

      {store.sortedSplitters.map((splitter) => (
        <Owage
          key={splitter}
          name={splitter}
          amount={store.owage.owage[splitter]}
          venmo={store.venmo}
          description={store.description}
        />
      ))}

      <div>{store.dirty ? "Saving..." : "Saved"}</div>
    </div>
  );
});

export const SplitSingle = () => {
  const { id } = useParams();

  const [store] = useState(() => new SplitStore(id!));

  useEffect(() => {
    const f = async () => {
      await store.fetchSplit();
      store.reactToUpdates();
    };

    f();

    return () => {
      store.dispose();
    };
  }, []);

  return <SplitSingleImpl store={store} />;
};
