import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { action, runInAction } from "mobx";
import { useParams } from "react-router-dom";
import { Item, SplitStore, store } from "src/stores/SplitStore";
import { Owage } from "src/Owage";

interface SplitSingleImplProps {
  split: {
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

export const SplitComp = observer(({ split }: SplitSingleImplProps) => {
  const [addedName, setAddedName] = useState("");

  return (
    <div className="App">
      <div>
        <label>Venmo Username</label>
        <input
          type="text"
          value={split.venmo}
          onChange={action((e) => split.setVenmo(e.target.value))}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={split.description}
          onChange={action((e) => split.setDescription(e.target.value))}
        />
      </div>

      <div>
        <label>Add Splitter</label>
        <input
          type="text"
          value={addedName}
          onChange={(e) => setAddedName(e.target.value)}
          onKeyDown={action((e) => {
            if (e.key === "Enter") {
              split.addSplitter(addedName);
              setAddedName("");
            }
          })}
        />
        <button
          tabIndex={-1}
          onClick={action(() => {
            split.addSplitter(addedName);
            setAddedName("");
          })}
        >
          Add Splitter
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Name</th>

            <th>Price</th>

            {split.sortedSplitters.map((splitter) => (
              <th key={splitter}>{splitter}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {split.items.map((item, i) => {
            return (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={action((e) =>
                      split.editItemName(i, e.target.value)
                    )}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.price ?? ""}
                    onChange={action((e) =>
                      split.editItemPrice(i, parseFloat(e.target.value))
                    )}
                    onKeyDown={action((e) => {
                      if (
                        e.key === "Tab" &&
                        !e.shiftKey &&
                        i === split.items.length - 1
                      ) {
                        split.addItem();
                      }
                    })}
                  />
                </td>

                {split.sortedSplitters.map((splitter) => {
                  return (
                    <td
                      style={{
                        width: "24px",
                        backgroundColor: item.splitters.has(splitter)
                          ? "black"
                          : "",
                        border: "1px solid blue",
                      }}
                      onClick={action(() =>
                        split.toggleSplitterOnItem(i, splitter)
                      )}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td>Subtotal</td>
            <td>{split.owage.subtotal.toFixed(2)}</td>

            {split.sortedSplitters.map((splitter) => (
              <td>{split.owage.subtotals[splitter].toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <button onClick={() => split.addItem()}>Add Item</button>

      <div>
        <span>Total: </span>
        <input
          type="number"
          value={split.total}
          onChange={action((e) => split.setTotal(parseFloat(e.target.value)))}
        />
      </div>

      {split.sortedSplitters.map((splitter) => (
        <Owage
          key={splitter}
          name={splitter}
          amount={split.owage.owage[splitter]}
          venmo={split.venmo}
          description={split.description}
        />
      ))}

      <div>{split.dirty ? "Saving..." : "Saved"}</div>
    </div>
  );
});

export const SplitSingle = observer(() => {
  const { id } = useParams();

  useEffect(
    action(() => {
      store.fetchSplit(id!);
    }),
    []
  );

  const split = store.getSplit(id!);

  if (!split) {
    return null;
  }

  return <SplitComp split={split} />;
});
