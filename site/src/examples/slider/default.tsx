import { useState } from "react";

import { Label } from "@infisical/cipher/ui/label";
import { Slider } from "@infisical/cipher/ui/slider";

export default function Example() {
  const [days, setDays] = useState([30]);
  const [accessWindow, setAccessWindow] = useState([20, 60]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-col gap-2">
            <Label id="slider-retention">Retention: {days[0]} days</Label>
            <Slider
              value={days}
              onValueChange={setDays}
              min={1}
              max={90}
              aria-labelledby="slider-retention"
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Single"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-col gap-2">
            <Label id="slider-window">
              Access window: day {accessWindow[0]} to {accessWindow[1]}
            </Label>
            <Slider
              value={accessWindow}
              onValueChange={setAccessWindow}
              min={0}
              max={90}
              minStepsBetweenThumbs={10}
              thumbLabels={["Access start day", "Access end day"]}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Range"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-col gap-2">
            <Label id="slider-managed">Managed retention: 30 days</Label>
            <Slider value={[30]} min={1} max={90} disabled aria-labelledby="slider-managed" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
