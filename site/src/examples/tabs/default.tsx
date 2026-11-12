import { Tabs } from "@infisical/cipher/ui/tabs";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tabs
            label="Secret sections"
            tabs={[
              { value: "overview", label: "Overview", content: "Value, comment and tags." },
              { value: "versions", label: "Versions", count: 15, content: "15 versions." },
              { value: "syncs", label: "Syncs", count: 3, content: "3 synced destinations." },
              {
                value: "policy",
                label: "Policy",
                disabled: true,
                content: "Unavailable on this plan."
              }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"underline"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tabs
            label="Environment"
            variant="segmented"
            tabs={[
              { value: "staging", label: "Staging", count: 12, content: "12 staging connections." },
              {
                value: "production",
                label: "Production",
                count: 4,
                content: "4 production connections."
              }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"segmented"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tabs
            label="Plan"
            variant="segmented"
            width="full"
            tabs={[
              { value: "pro", label: "Pro", content: "Pro features." },
              { value: "advanced", label: "Advanced", content: "Advanced features." },
              { value: "enterprise", label: "Enterprise", content: "Enterprise features." }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"segmented, full width"}</figcaption>
      </figure>
    </div>
  );
}
