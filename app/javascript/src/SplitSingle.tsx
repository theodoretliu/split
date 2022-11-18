import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { action, runInAction } from "mobx";
import { useParams } from "react-router-dom";
import { Item, SplitStore, store, ValidatedItem } from "src/stores/SplitStore";
import { Owage } from "src/Owage";
import { Option } from "src/option";

interface ListOwagesProps {
  sortedSplitters: string[];
  owage: {
    owage: Record<string, number>;
  };
  venmo: string;
  description: string;
}
const ListOwages = ({
  sortedSplitters,
  owage,
  venmo,
  description,
}: ListOwagesProps) => {
  return (
    <>
      {sortedSplitters.map((splitter) => (
        <Owage
          key={splitter}
          name={splitter}
          amount={owage.owage[splitter]}
          venmo={venmo}
          description={description}
        />
      ))}
    </>
  );
};

interface SplitSingleImplProps {
  split: {
    venmo: string;
    description: string;
    splitters: Set<string>;
    validatedItems: Array<ValidatedItem>;
    total: number;

    sortedSplitters: Array<string>;
    owage: Option<{
      subtotal: number;
      subtotals: Record<string, number>;
      owage: Record<string, number>;
    }>;

    setVenmo: (venmo: string) => void;
    setDescription: (description: string) => void;
    addSplitter: (name: string) => void;
    removeSplitter: (name: string) => void;
    addItem: () => void;
    editItemName: (i: number, name: string) => void;
    editItemPrice: (i: number, unparsedPrice: string) => void;
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
          {split.validatedItems.map((item, i) => {
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
                    style={{ border: item.valid ? "" : "1px solid red" }}
                    type="text"
                    inputMode="decimal"
                    value={item.unparsedPrice ?? ""}
                    onChange={action((e) => {
                      split.editItemPrice(i, e.target.value);
                    })}
                    onKeyDown={action((e) => {
                      if (
                        e.key === "Tab" &&
                        !e.shiftKey &&
                        i === split.validatedItems.length - 1
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

            {split.owage.type === "None" ? (
              <td colSpan={split.sortedSplitters.length + 1}>
                There are errors in the price, please correct them
              </td>
            ) : (
              ((owage) => (
                <>
                  <td>{owage.subtotal.toFixed(2)}</td>

                  {split.sortedSplitters.map((splitter) => (
                    <td>{owage.subtotals[splitter].toFixed(2)}</td>
                  ))}
                </>
              ))(split.owage.value)
            )}
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

      {split.owage.type === "None" ? (
        <div>Correct errors in price before continuing</div>
      ) : (
        <ListOwages
          sortedSplitters={split.sortedSplitters}
          owage={split.owage.value}
          venmo={split.venmo}
          description={split.description}
        />
      )}

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
