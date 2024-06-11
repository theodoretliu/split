import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Split, store } from "~/stores/SplitStore";
import { action } from "mobx";
import { observer } from "mobx-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getUrl } from "~/Owage";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Item } from "@radix-ui/react-select";

interface SplitShareViewProps {
  split: Split;
}

const SplitShareView = observer(({ split }: SplitShareViewProps) => {
  const [selectedPerson, setSelectedPerson] = useState<string | undefined>(
    undefined
  );

  const personOwage =
    split.owage.type === "Some" && selectedPerson
      ? split.owage.value.owage[selectedPerson]
      : undefined;

  return (
    <div className="p-4 pb-12 max-w-[1024px] mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label>Hey, what's your name?</Label>

        <Select value={selectedPerson ?? ""} onValueChange={setSelectedPerson}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select your name" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Splitters</SelectLabel>

              {Array.from(split.splitters).map((name) => {
                return <SelectItem value={name}>{name}</SelectItem>;
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedPerson !== undefined && personOwage !== undefined && (
        <>
          <Card className="max-w-[300px] flex flex-col gap-2 p-4">
            <p className="text-sm text-muted-foreground">
              Hey, {selectedPerson}! You owe
            </p>

            <h1 className="font-semibold tracking-tight text-4xl">
              ${personOwage.toFixed(2)}
            </h1>

            <Button asChild className="w-fit">
              <a
                href={getUrl({
                  recipient: split.venmo,
                  amount: personOwage.toFixed(2),
                  note: split.description,
                })}
                target="_blank"
              >
                Pay with Venmo
              </a>
            </Button>

            <Button
              variant="link"
              onClick={() => setSelectedPerson(undefined)}
              className="p-0 text-muted-foreground h-auto w-fit"
            >
              Not {selectedPerson}?
            </Button>
          </Card>

          <div className="flex flex-col gap-4">
            <h2 className="font-medium">See the full breakdown below</h2>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>

                    <TableHead>Price</TableHead>

                    <TableHead className="hidden md:table-cell">
                      Splitters
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {split.validatedItems.map((item, i) => {
                    return (
                      <Fragment key={i}>
                        <TableRow>
                          <TableCell>{item.name}</TableCell>

                          <TableCell>
                            {item.unparsedPrice &&
                              Number(item.unparsedPrice).toFixed(2)}
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            {Array.from(item.splitters).join(", ")}
                          </TableCell>
                        </TableRow>

                        <TableRow className="table-row md:hidden">
                          <TableCell
                            colSpan={3}
                            className="px-4 py-2 text-right"
                          >
                            Shared by {Array.from(item.splitters).join(", ")}
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}

                  <TableRow>
                    <TableCell>Subtotal</TableCell>

                    <TableCell className="md:hidden table-cell">
                      {split.owage.type === "Some" &&
                        split.owage.value.subtotal.toFixed(2)}
                    </TableCell>

                    <TableCell className="md:table-cell hidden" colSpan={2}>
                      {split.owage.type === "Some" &&
                        split.owage.value.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Total</TableCell>

                    <TableCell className="md:hidden table-cell">
                      {split.total?.toFixed(2)}
                    </TableCell>

                    <TableCell className="md:table-cell hidden" colSpan={2}>
                      {split.total?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export const SplitShare = observer(() => {
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

  return <SplitShareView split={split} />;
});
