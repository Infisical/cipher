import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@infisical/cipher/ui/button";
import { Calendar } from "@infisical/cipher/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@infisical/cipher/ui/popover";

const month = new Date(2026, 10, 1);
const readable = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function Example() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 10, 1),
    to: new Date(2026, 10, 15)
  });
  const label =
    range?.from && range.to ? `${readable(range.from)} to ${readable(range.to)}` : "Custom range";
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" icon="calendar">
              {label}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" aria-label="Custom date range">
            <Calendar
              mode="range"
              aria-label="Custom date range"
              defaultMonth={month}
              selected={range}
              onSelect={setRange}
              footer={label}
            />
          </PopoverContent>
        </Popover>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"A Calendar placed straight in a PopoverContent"}
      </figcaption>
    </figure>
  );
}
