import { Tabs } from "@infisical/cipher/ui/tabs";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tabs
            label="Needs attention"
            tabs={[
              { value: "renewals", label: "Renewals", count: 1, content: "1 renewal due." },
              {
                value: "suspended",
                label: "Suspended",
                count: 1,
                countTone: "bad",
                content: "1 suspended account."
              },
              {
                value: "overdue",
                label: "Overdue invoices",
                count: 12,
                countTone: "warn",
                content: "12 overdue invoices."
              },
              { value: "trials", label: "Trials", count: 0, content: "No trials ending." }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"countTone: bad and warn flag trouble, neutral counts volume"}
        </figcaption>
      </figure>
    </div>
  );
}
