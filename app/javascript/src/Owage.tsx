import React from "react";
import { TableCell, TableRow } from "./components/ui/table";
import { Button } from "./components/ui/button";

interface OwageProps {
  name: string;
  amount: number;
  venmo: string;
  description: string;
}

export function getUrl({
  recipient,
  amount,
  note,
}: {
  recipient: string;
  amount: string;
  note: string;
}): string {
  const urlParams = {
    recipients: recipient,
    amount,
    note,
    audience: "private",
    txn: "pay",
  };

  let s = [];
  for (const [key, value] of Object.entries(urlParams)) {
    s.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  }

  return `https://account.venmo.com/?${s.join("&")}`;
}

export const Owage: React.FC<OwageProps> = ({
  name,
  amount,
  venmo,
  description,
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-row items-center justify-between w-full gap-4">
          <span className="truncate">
            {name} owes ${amount.toFixed(2)}
          </span>

          {/* <a
            target="_blank"
            href={getUrl({
              recipient: venmo,
              amount: amount.toFixed(2),
              note: description,
            })}
            className="text-primary underline-offset-4 hover:underline font-medium whitespace-nowrap shrink-0"
          >
            Pay with Venmo
          </a> */}
        </div>
      </TableCell>
    </TableRow>
  );
};
