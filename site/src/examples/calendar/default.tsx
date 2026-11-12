import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@infisical/cipher/ui/calendar";

const month = new Date(2026, 8, 1);
const readable = (date: Date) =>
  date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const rangeSummary = (range: DateRange | undefined) => {
  if (!range?.from) return "Choose a start date";
  if (!range.to) return `Start ${readable(range.from)}. Choose an end date.`;
  return `${readable(range.from)} to ${readable(range.to)}`;
};
export default function Example() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 14));
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 8, 14),
    to: undefined
  });
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure aria-label="Single expiry date" className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Calendar
            aria-label="Expiry date"
            mode="single"
            defaultMonth={month}
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date(2026, 8, 3) }}
            footer={date ? readable(date) : "Choose an expiry date"}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Single expiry date"}</figcaption>
      </figure>
      <figure
        aria-label="Date range with month and year controls"
        className="m-0 flex w-full min-w-0 flex-col gap-3"
      >
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Calendar
            aria-label="Access window"
            mode="range"
            min={2}
            max={7}
            excludeDisabled
            disabled={{ dayOfWeek: [0, 6] }}
            defaultMonth={month}
            selected={range}
            onSelect={setRange}
            captionLayout="dropdown"
            startMonth={new Date(2025, 0, 1)}
            endMonth={new Date(2027, 11, 31)}
            footer={rangeSummary(range)}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Date range with month and year controls"}
        </figcaption>
      </figure>
    </div>
  );
}
