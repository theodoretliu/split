import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { action, runInAction } from "mobx";
import { useParams } from "react-router-dom";
import {
  Item,
  SplitStore,
  store,
  ValidatedItem,
  Split,
} from "~/stores/SplitStore";
import { Owage } from "src/Owage";
import { Option } from "src/option";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FormItem } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { PersonSelector } from "./components/PersonSelector";
import { Check, LoaderCircle, Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

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
    <div className="w-full rounded-md border">
      <Table className="table-fixed">
        {sortedSplitters.map((splitter) => (
          <Owage
            key={splitter}
            name={splitter}
            amount={owage.owage[splitter]}
            venmo={venmo}
            description={description}
          />
        ))}
      </Table>
    </div>
  );
};

interface SplitSingleImplProps {
  split: Split;
}

export const SplitComp = observer(({ split }: SplitSingleImplProps) => {
  const [addedName, setAddedName] = useState("");

  return (
    <div className="p-4 pb-12">
      <div className="flex flex-col gap-2">
        <FormItem>
          <Label>Venmo Username</Label>
          <Input
            type="text"
            value={split.venmo}
            onChange={action((e) => split.setVenmo(e.target.value))}
            placeholder="theodoretliu"
          />
        </FormItem>

        <FormItem>
          <Label>Description</Label>

          <Input
            type="text"
            value={split.description}
            onChange={action((e) => split.setDescription(e.target.value))}
            placeholder="Group dinner at Tanglad"
          />
        </FormItem>

        <FormItem>
          <Label>Add Splitter</Label>
          <div className="flex flex-row items-center gap-2">
            <Input
              type="text"
              value={addedName}
              onChange={(e) => setAddedName(e.target.value)}
              onKeyDown={action((e) => {
                if (e.key === "Enter") {
                  split.addSplitter(addedName);
                  setAddedName("");
                }
              })}
              placeholder="Teddy"
            />

            <Button
              tabIndex={-1}
              onClick={action(() => {
                split.addSplitter(addedName);
                setAddedName("");
              })}
            >
              Add Splitter
            </Button>
          </div>
        </FormItem>

        <div className="border rounded-md w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>

                <TableHead className="w-[75px]">Price</TableHead>

                {split.sortedSplitters.map((splitter) => (
                  <TableHead key={splitter} className="hidden">
                    {splitter}
                  </TableHead>
                ))}

                <TableHead className="pl-0 w-8">
                  <div className="h-full w-full flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {split.validatedItems.map((item, i) => {
                return (
                  <>
                    <TableRow key={i}>
                      <TableCell>
                        <input
                          type="text"
                          value={item.name}
                          onChange={action((e) =>
                            split.editItemName(i, e.target.value)
                          )}
                          className="w-full"
                        />
                      </TableCell>

                      <TableCell className="w-[75px]">
                        <input
                          style={{ border: item.valid ? "" : "1px solid red" }}
                          type="text"
                          inputMode="decimal"
                          value={item.unparsedPrice ?? ""}
                          onChange={action((e) => {
                            split.editItemPrice(i, e.target.value);
                          })}
                          className="w-full"
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
                      </TableCell>

                      {split.sortedSplitters.map((splitter) => {
                        return (
                          <TableCell
                            style={{
                              width: "24px",
                              backgroundColor: item.splitters.has(splitter)
                                ? "black"
                                : "",
                              border: "1px solid blue",
                            }}
                            className="hidden"
                            onClick={action(() =>
                              split.toggleSplitterOnItem(i, splitter)
                            )}
                          />
                        );
                      })}

                      <TableCell className="pl-0 w-8">
                        <div className="flex flex-col items-center justify-center h-full">
                          <button onClick={action(() => split.removeItem(i))}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={3}>
                        <PersonSelector
                          people={Array.from(split.splitters).map((s) => ({
                            name: s,
                            checked: item.splitters.has(s),
                          }))}
                          setPersonChecked={(name, checked) => {
                            split.toggleSplitterOnItem(i, name);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}

              <TableRow>
                <TableCell colSpan={2} />

                <TableCell className="w-8 pl-0">
                  <div className="w-full flex items-center justify-center">
                    <button onClick={() => split.addItem()}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Subtotal</TableCell>

                {split.owage.type === "None" ? (
                  <TableCell colSpan={split.sortedSplitters.length + 1}>
                    There are errors in the price, please correct them
                  </TableCell>
                ) : (
                  ((owage) => (
                    <>
                      <TableCell colSpan={2}>
                        {owage.subtotal.toFixed(2)}
                      </TableCell>

                      {split.sortedSplitters.map((splitter) => (
                        <td className="hidden">
                          {owage.subtotals[splitter].toFixed(2)}
                        </td>
                      ))}
                    </>
                  ))(split.owage.value)
                )}
              </TableRow>

              <TableRow>
                <TableCell>Total</TableCell>

                <TableCell colSpan={2}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={split.rawTotal}
                    onChange={action((e) => {
                      split.rawTotal = e.target.value;
                    })}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="fixed bottom-4 left-4 p-1 rounded-md border bg-white">
              {split.dirty ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </div>
          </TooltipTrigger>

          <TooltipContent side="right">
            <p>{split.dirty ? "Saving..." : "Saved"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
