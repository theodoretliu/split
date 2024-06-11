import React, { Fragment, useEffect, useState } from "react";
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
import { PersonSelector } from "~/components/PersonSelector";
import { Check, LoaderCircle, Plus, X, Clipboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Code } from "./components/ui/typography";

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
  const { id } = useParams();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [copied]);

  if (sortedSplitters.length === 0 || id === undefined) {
    return null;
  }

  const viewUrl = `${window.location.origin}/splits/${id}/view`;

  return (
    <>
      <div className="w-full rounded-md border">
        <Table className="table-fixed">
          <TableBody>
            {sortedSplitters.map((splitter) => (
              <Owage
                key={splitter}
                name={splitter}
                amount={owage.owage[splitter]}
                venmo={venmo}
                description={description}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">
            Share this with your friends
          </CardTitle>

          <CardDescription>Copy and send them the link below!</CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex flex-row items-center gap-2 w-full">
            <Code className="hyphens-auto grow basis-0 min-w-0">
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {viewUrl}
              </a>
            </Code>

            <button
              onClick={() => {
                navigator.clipboard.writeText(viewUrl);
                setCopied(true);
              }}
              className="rounded-md border p-1 flex items-center justify-center shrink-0"
            >
              {!copied ? (
                <Clipboard className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* <CardDescriptio>
            In person? Have them scan the QR code with their phone's camera
          </CardDescriptio> */}
          {/* <QRCo */}
        </CardContent>
      </Card>
    </>
  );
};

interface SplitSingleImplProps {
  split: Split;
}

export const SplitComp = observer(({ split }: SplitSingleImplProps) => {
  const [addedName, setAddedName] = useState("");

  return (
    <div className="p-4 pb-12 max-w-[1024px] mx-auto">
      <div className="flex flex-col gap-2">
        <FormItem>
          <Label>Venmo Username</Label>
          <Input
            type="text"
            value={split.venmo}
            onChange={action((e) => {
              split.setVenmo(e.target.value);
            })}
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
                <TableHead className="pr-0">Item Name</TableHead>

                <TableHead className="w-[95px]">Price</TableHead>

                <TableHead className="hidden md:table-cell">
                  Splitters
                </TableHead>

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
                  <Fragment key={i}>
                    <TableRow key={i}>
                      <TableCell className="pr-0">
                        <Input
                          type="text"
                          value={item.name}
                          onChange={action((e) =>
                            split.editItemName(i, e.target.value)
                          )}
                          className="w-full px-2 py-1 h-auto"
                        />
                      </TableCell>

                      <TableCell className="w-[95px]">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={item.unparsedPrice ?? ""}
                          onChange={action((e) => {
                            split.editItemPrice(i, e.target.value);
                          })}
                          className={cn(
                            "w-full px-2 py-1 h-auto",
                            !item.valid && "border-red-400 border"
                          )}
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

                      <TableCell className="hidden md:table-cell pl-0">
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

                      <TableCell className="pl-0 w-8">
                        <div className="flex flex-col items-center justify-center h-full">
                          <button onClick={action(() => split.removeItem(i))}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow className="md:hidden">
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
                  </Fragment>
                );
              })}

              <TableRow>
                <TableCell colSpan={2} />
                <TableCell className="hidden md:table-cell" />

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
                  <>
                    <TableCell className="table-cell md:hidden" colSpan={2}>
                      There are errors in the price, please correct them
                    </TableCell>
                    <TableCell className="hidden md:table-cell" colSpan={3}>
                      There are errors in the price, please correct them
                    </TableCell>
                  </>
                ) : (
                  ((owage) => (
                    <>
                      <TableCell className="table-cell md:hidden" colSpan={2}>
                        {owage.subtotal.toFixed(2)}
                      </TableCell>

                      <TableCell className="hidden md:table-cell" colSpan={3}>
                        {owage.subtotal.toFixed(2)}
                      </TableCell>
                    </>
                  ))(split.owage.value)
                )}
              </TableRow>

              <TableRow>
                <TableCell>Total</TableCell>

                <TableCell colSpan={2}>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={split.rawTotal}
                    onChange={action((e) => {
                      split.rawTotal = e.target.value;
                    })}
                    className={cn(
                      "w-full px-2 py-1 h-auto",
                      split.total === undefined && "border-red-400 border"
                    )}
                  />
                </TableCell>

                <TableCell className="hidden md:table-cell" />
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {split.owage.type === "None" || split.total === undefined ? (
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
