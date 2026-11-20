import { Alert } from "@infisical/cipher/ui/alert";
import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { PageHeader } from "@infisical/cipher/ui/page-header";

const rules = [
  "success is only for the one action that completes a positive outcome behind a gate, once the gate has passed: Merge on an approved change request.",
  "Approve, Save and Create keep their current variants. Approving is one step toward the gate, not the outcome.",
  "destructive stays for Delete, Revoke, Remove and other actions that lose something.",
  "Use at most one success button per view, and only while the action can run. While it is blocked, disable it and say why."
];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "Change requests", href: "#/components/button" }]}
          title="Rotate DB_PASSWORD in Production"
          badges={<Badge tone="warn">Open</Badge>}
          description="Opened by Dana Wu 3 minutes ago"
          actions={
            <>
              <Button variant="outline">Update review</Button>
              <Button variant="outline">Close request</Button>
              <Button variant="success">Merge</Button>
            </>
          }
        />
        <Alert tone="ok" title="Good to merge" />
        <figcaption className="text-muted-foreground text-xs">
          {"Ready: Merge completes the approved request"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          title="Add STRIPE_KEY to Staging"
          badges={<Badge tone="warn">Open</Badge>}
          actions={
            <>
              <Button variant="outline">Update review</Button>
              <Button variant="success" disabledReason="Needs 1 more approval">
                Merge
              </Button>
            </>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Blocked: disabled with the reason, not success-colored"}
        </figcaption>
      </figure>
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-sm">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}
