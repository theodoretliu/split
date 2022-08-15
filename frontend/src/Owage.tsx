import React from "react";

interface OwageProps {
  name: string;
  amount: number;
  venmo: string;
  description: string;
}

function getUrl({
  recipient,
  amount,
  note,
}: {
  recipient: string;
  amount: string;
  note: string;
}): string {
  const urlParams = new URLSearchParams({
    recipients: recipient,
    amount,
    note,
    audience: "private",
  });

  return `https://venmo.com/?${urlParams.toString()}`;
}

export const Owage: React.FC<OwageProps> = ({
  name,
  amount,
  venmo,
  description,
}) => {
  return (
    <div>
      <span>
        {name} owes {amount.toFixed(2)}
      </span>

      <a
        target="_blank"
        href={getUrl({
          recipient: venmo,
          amount: amount.toFixed(2),
          note: description,
        })}
      >
        Pay with Venmo
      </a>
    </div>
  );
};
