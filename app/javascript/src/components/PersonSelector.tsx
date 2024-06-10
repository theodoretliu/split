"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/utilities";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { observer } from "mobx-react";

interface PersonSelectorProps {
  people: { name: string; checked: boolean }[];

  setPersonChecked: (name: string, checked: boolean) => void;
}

export const PersonSelector = ({
  people,
  setPersonChecked,
}: PersonSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const selectedPeople = people.filter((person) => person.checked);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          <span className="truncate">
            {selectedPeople.length === 0
              ? "No one selected"
              : selectedPeople.map((person) => person.name).join(", ")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandEmpty className="py-2">No splitters yet.</CommandEmpty>

              {people.map((person, i) => (
                <CommandItem
                  key={i}
                  value={person.name}
                  onSelect={(name: string) => {
                    setPersonChecked(name, !person.checked);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      person.checked ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {person.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
