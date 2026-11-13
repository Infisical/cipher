import { Button } from "@infisical/cipher/ui/button";
import { Item, ItemGroup, Media, type ItemProps } from "@infisical/cipher/ui/item";

const Row = ({
  subject,
  rest,
  single,
  ...props
}: ItemProps & { subject: string; rest?: string; single?: boolean }) => (
  <Item
    variant="outline"
    title={
      <>
        {subject}
        {rest && <span className="font-normal">{rest}</span>}
      </>
    }
    actions={
      <>
        {!single && <Button variant="outline">Review</Button>}
        <Button>{single ? "View" : "Approve"}</Button>
      </>
    }
    {...props}
  />
);

const Case = ({
  id,
  caption,
  width,
  children
}: {
  id: string;
  caption: string;
  width?: number;
  children: React.ReactNode;
}) => (
  <figure
    data-case={id}
    className="m-0 flex w-full min-w-0 flex-col gap-3"
    style={{ maxWidth: width }}
  >
    <ItemGroup>{children}</ItemGroup>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

const longRest =
  " changed in payments-reconciliation-service across production, staging and the eu-west-1 disaster recovery environment";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      <Case
        id="wrap-inline"
        width={760}
        caption="Wrapping title, 760px: the timestamp stays on the first line"
      >
        <Row
          media={<Media icon="key" tone="ok" />}
          subject="47 secrets"
          rest={longRest}
          meta="12m"
          description="Dana Wu. Needs 2 approvals."
        />
      </Case>
      <Case
        id="wrap-stacked"
        width={520}
        caption="Stacked below 44rem: timestamp at the end of the title row, buttons on their own row at the copy edge"
      >
        <Row
          media={<Media icon="terminal" tone="bad" />}
          subject="Break-glass"
          rest=" access to prod-postgres-eu"
          meta="4m"
          description="Leo Park. Incident 2291. Expires in 40 min."
        />
        <Row
          media={<Media icon="key" tone="ok" />}
          subject="47 secrets"
          rest={longRest}
          meta="12m"
          description="Dana Wu. Needs 2 approvals."
        />
      </Case>
      <Case
        id="stacked-short"
        width={520}
        caption="Stacked, short titles: the timestamp is pinned to the end of the title row"
      >
        <Row
          media={<Media icon="user" tone="info" />}
          subject="Admin role"
          meta="3h"
          description="Priya Shah. Org admin, 7 days."
        />
        <Row
          media={<Media icon="key" tone="ok" />}
          subject="Rotate"
          rest=" DB_PASSWORD"
          meta="just now"
          description="rotation-bot. ledger-core, production."
        />
        <Row
          media={<Media icon="cert" tone="warn" />}
          subject="api.acme.com"
          rest=" certificate request"
          meta="Nov 4"
          description="deploy-bot. Profile web-tls."
        />
      </Case>
      <Case id="long-description" caption="No description, and a description that wraps">
        <Row
          media={<Media icon="cert" tone="warn" />}
          subject="api.acme.com"
          rest=" certificate request"
          meta="1h"
        />
        <Row
          media={<Media icon="terminal" tone="bad" />}
          subject="Break-glass"
          rest=" access to prod-postgres-eu"
          meta="4m"
          description="Leo Park opened incident 2291 after the primary failed over to the eu-west-1 replica and the ledger-core migration stalled halfway through. Access expires in 40 min and is recorded in the session log. On-call has been paged and the change freeze for prod-postgres-eu stays in effect until the incident closes."
        />
      </Case>
      <Case id="buttons" caption="One button against two">
        <Row
          single
          media={<Media icon="cert" tone="warn" />}
          subject="api.acme.com"
          rest=" certificate request"
          meta="1h"
          description="deploy-bot. Profile web-tls."
        />
        <Row
          media={<Media icon="cert" tone="warn" />}
          subject="api.acme.com"
          rest=" certificate request"
          meta="1h"
          description="deploy-bot. Profile web-tls."
        />
      </Case>
    </div>
  );
}
