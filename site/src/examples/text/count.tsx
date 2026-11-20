import { Tabs } from "@infisical/cipher/ui/tabs";
import { Heading } from "@infisical/cipher/ui/text";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Heading level={2} count={0}>
            Needs attention
          </Heading>
          <Tabs
            label="Licenses"
            tabs={[
              { value: "attention", label: "Expiring", count: 0, content: "Nothing expiring." },
              { value: "unpaid", label: "Unpaid", count: 0, content: "No unpaid invoices." }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"count 0"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Heading level={2} count={7}>
            Needs attention
          </Heading>
          <Tabs
            label="Licenses"
            tabs={[
              {
                value: "attention",
                label: "Expiring",
                count: 4,
                content: "Licenses expiring in the next 30 days."
              },
              {
                value: "unpaid",
                label: "Unpaid",
                count: 3,
                content: "Licenses with an unpaid invoice."
              }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"count above Tabs"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Heading level={2} count="12,480">
            Licenses that need attention before their renewal date across every region
          </Heading>
          <Tabs
            label="Licenses"
            tabs={[
              {
                value: "attention",
                label: "Expiring",
                count: 9214,
                content: "Licenses expiring in the next 30 days."
              },
              {
                value: "unpaid",
                label: "Unpaid",
                count: 3266,
                content: "Licenses with an unpaid invoice."
              }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"long title, large count"}
        </figcaption>
      </figure>
    </div>
  );
}
