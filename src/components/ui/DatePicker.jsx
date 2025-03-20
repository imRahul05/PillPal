// src/components/ui/DatePicker.jsx
import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({
  selected,
  onSelect,
  disabled,
  className,
  placeholder = "Pick a date",
  ...props
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto bg-[hsl(var(--card))] border-[hsl(var(--border))] z-[60] p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
          className={cn("p-4 rounded-md border-[hsl(var(--border))]")}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };