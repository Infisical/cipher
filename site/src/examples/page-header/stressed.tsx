import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { PageHeader } from "@infisical/cipher/ui/page-header";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            breadcrumb={[{ label: "Projects", href: "#page-header" }]}
            title="payments-settlement-reconciliation-backend-worker-eu-west"
            badges={<Badge tone="warn">Production</Badge>}
            description="Reconciles card settlements against the ledger every night and posts the differences to the finance channel, so the team can review them before the books close."
            actions={
              <>
                <Button variant="outline" icon="download">
                  Export
                </Button>
                <Button variant="accent" icon="plus">
                  Add secret
                </Button>
              </>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "A long title wraps. On a narrow header it stops at two lines, a tap shows the rest, and icon buttons drop to their glyph"
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            title="Machine identity authentication and token renewal settings"
            badges={
              <DocumentationLink
                href="https://infisical.com/docs/documentation/platform/identities/machine-identities"
                subject="machine identities"
              />
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"The docs link stays at the end of a wrapped title's last line"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            size="md"
            truncateTitle
            title="payments-settlement-reconciliation-backend-worker-eu-west"
            badges={<Badge tone="info">Enterprise</Badge>}
            actions={
              <Button variant="outline" icon="plus">
                Add secret
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"truncateTitle keeps a long title on one line"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            title="Organization overview"
            actions={
              <>
                <Button variant="outline">Invite members</Button>
                <Button variant="accent">New project</Button>
              </>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"On a narrow header, actions move below the title and description"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            breadcrumb={[{ label: "Gateways", href: "#page-header" }]}
            title="gateway-eu-central-1"
            badges={
              <Badge tone="info" collapse>
                Privileged Access Management · Enterprise
              </Badge>
            }
            actions={
              <Button variant="outline" icon="more">
                Options
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"On a narrow header, a collapsible badge shortens beside the title before it wraps"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader
            breadcrumb={[{ label: "Secrets", href: "#page-header" }]}
            title="payments-settlement-reconciliation-backend-worker-eu-west"
            moreActions={[
              { label: "Export", icon: "download", onSelect: () => undefined },
              { label: "View audit log", icon: "history", href: "#page-header" },
              {
                label: "Delete secret",
                icon: "trash",
                variant: "destructive",
                onSelect: () => undefined
              }
            ]}
            actions={<Button variant="accent">Rotate now</Button>}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "moreActions are buttons on a wide header and move into a More actions menu on a narrow one"
          }
        </figcaption>
      </figure>
    </div>
  );
}
