import React from "react";
import { cn } from "~/utilities";

export const Code = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}
  >
    {children}
  </code>
);
