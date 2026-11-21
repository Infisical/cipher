import { useState } from "react";

import { Stack } from "@infisical/cipher/ui/layout";
import { Tabs } from "@infisical/cipher/ui/tabs";
import { Heading } from "@infisical/cipher/ui/text";

const reasons = [
  { value: "all", label: "All", count: 48 },
  { value: "expiring", label: "Expiring soon", count: 12, countTone: "warn" as const },
  { value: "suspended", label: "Suspended for payment", count: 3, countTone: "bad" as const },
  { value: "trials", label: "Trials ending this week", count: 9 },
  { value: "overage", label: "Seat overage", count: 7, countTone: "warn" as const },
  { value: "unsigned", label: "Unsigned order forms", count: 4 },
  { value: "dismissed", label: "Dismissed", count: 13 }
];

export default function Example() {
  const [current, setCurrent] = useState("overage");
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex">
            <div className="flex-1">
              <Stack gap={16}>
                <Heading level={2} count={48}>
                  Needs attention
                </Heading>
                <Tabs
                  label="Needs attention"
                  value={current}
                  onChange={setCurrent}
                  tabs={reasons.map((reason) => ({
                    ...reason,
                    content: `${reason.count} licenses.`
                  }))}
                />
              </Stack>
            </div>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"many long tabs in a flex row, active tab off the start"}
        </figcaption>
      </figure>
    </div>
  );
}
