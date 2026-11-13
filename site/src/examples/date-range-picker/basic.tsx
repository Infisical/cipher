import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { DateRangePicker } from "@infisical/cipher/ui/date-range-picker";
import { Label } from "@infisical/cipher/ui/label";

export default function Example() {
  const [empty, setEmpty] = useState<DateRange | undefined>();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 10, 3),
    to: new Date(2026, 10, 12)
  });
  const [wide, setWide] = useState<DateRange | undefined>();
  return (
    <div className="flex w-full min-w-0 flex-wrap items-end gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="range-empty">Rotation window</Label>
        <DateRangePicker id="range-empty" value={empty} onValueChange={setEmpty} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="range-set">Access window</Label>
        <DateRangePicker id="range-set" value={range} onValueChange={setRange} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="range-wide">Two months</Label>
        <DateRangePicker
          id="range-wide"
          value={wide}
          onValueChange={setWide}
          numberOfMonths={2}
          placeholder="Choose a window"
        />
      </div>
    </div>
  );
}
