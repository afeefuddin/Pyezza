"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { timezoneOptions } from "@/lib/timezone";
import { getTimezoneOffset } from "@/lib/timezone";

interface TimezoneComboBoxProps {
  value: string;
  onChange: (val: string) => void;
}

export function TimezoneComboBox({ value, onChange }: TimezoneComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  // Find the current timezone option
  const currentTimezone = timezoneOptions[value];

  // Optionally, compute the offset string dynamically.
  let dynamicOffset = "";
  if (value) {
    const offsetNumber = getTimezoneOffset(value);
    // Format the offset with sign and two decimals (if needed)
    const sign = offsetNumber >= 0 ? "+" : "-";
    dynamicOffset =
      "GMT" +
      sign +
      Math.abs(offsetNumber).toFixed(2).replace(/\.00$/, "") +
      "";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-full lg:w-96 justify-between"
        >
          {currentTimezone
            ? `${currentTimezone.label} (${currentTimezone.zones.join(", ")})`
            : "Select timezone..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="max-h-96 overflow-auto">
            <CommandList>
              {Object.entries(timezoneOptions).map(([key, tz]) => (
                <CommandItem
                  key={key}
                  value={`${tz.label} ${tz.zones.join(" ")}`}
                  onSelect={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === key ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div className="font-medium">{tz.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {(tz.zones || []).join(", ")}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
