import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Media } from "@infisical/cipher/ui/item";
import { PageHeader } from "@infisical/cipher/ui/page-header";
import { Tabs } from "@infisical/cipher/ui/tabs";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            title="Organization overview"
            description="2 approvals and 1 failed sync need you."
            actions={
              <>
                <Button variant="outline">Invite members</Button>
                <Button variant="accent">New project</Button>
              </>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"lg"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            size="md"
            mono
            title="stripe_api_key"
            media={<Media icon="key" size="md" />}
            breadcrumb={[
              { label: "payments-api", href: "#page-header" },
              { label: "backend", href: "#page-header" },
              { label: "billing", href: "#page-header" },
              { label: "providers", href: "#page-header" },
              { label: "stripe", href: "#page-header" }
            ]}
            maxItems={3}
            badges={
              <>
                <Badge tone="warn">Production</Badge>
                <Badge>v14</Badge>
              </>
            }
            description="Rotated 12 days ago by Sarah Lin."
            actions={<Button variant="outline">Rotate</Button>}
            tabs={
              <Tabs
                label="Secret sections"
                tabs={[
                  { value: "overview", label: "Overview", content: null },
                  { value: "versions", label: "Versions", count: 14, content: null },
                  { value: "syncs", label: "Syncs", count: 3, content: null }
                ]}
              />
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"md"}</figcaption>
      </figure>
    </div>
  );
}
