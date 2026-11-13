import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { DetailLayout } from "@infisical/cipher/ui/layout";
import { DataList, List, ListRow } from "@infisical/cipher/ui/list";

const Specimen = () => (
  <DetailLayout
    asideLabel="Details"
    aside={
      <Card variant="framed" title="Details">
        <DataList
          variant="props"
          items={[
            ["ID", <code key="id">4b1e8c2a-93f0-4d55-a1c6-0e7d2f9b3a11</code>],
            ["Managed by", "Organization"],
            ["Organization role", "Member"],
            [
              "Metadata",
              <Badge key="meta" tone="outline" mono>
                runner=github-actions-self-hosted
              </Badge>
            ],
            ["Last login", "Never"]
          ]}
        />
      </Card>
    }
  >
    <List
      label="Auth methods"
      title="Authentication"
      action={
        <Button variant="outline" size="sm" icon="plus">
          Add auth method
        </Button>
      }
    >
      <ListRow
        value="universal"
        label="Universal Auth"
        title="Universal Auth"
        description="Last used 4 minutes ago"
      />
      <ListRow
        value="oidc"
        label="OIDC Auth"
        title="OIDC Auth"
        description="Not used in the last 30 days"
      />
    </List>
    <List label="Projects" title="Projects">
      <ListRow
        value="payments"
        label="payments-api"
        title={<code>payments-api</code>}
        meta="Developer"
      />
      <ListRow
        value="platform"
        label="platform-core-shared-infrastructure-eu-west-1"
        title={<code>platform-core-shared-infrastructure-eu-west-1</code>}
        meta="Viewer"
      />
    </List>
  </DetailLayout>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Specimen />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Wide container, sidecar on the right"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div style={{ maxWidth: "var(--cipher-size-measure-form)" }}>
            <Specimen />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Narrow container, sidecar stacks above the main cards"}
        </figcaption>
      </figure>
    </div>
  );
}
