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

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      <Case id="standard" caption="Inline: the timestamp hugs the title, the buttons share the row">
        <Row
          media={<Media icon="terminal" tone="bad" />}
          subject="Break-glass"
          rest=" access to prod-postgres-eu"
          meta="4m"
          description="Leo Park. Incident 2291. Expires in 40 min."
        />
        <Row
          media={<Media icon="key" tone="ok" />}
          subject="12 secrets"
          rest=" changed in ledger-core, production"
          meta="12m"
          description="Dana Wu. Needs 2 approvals."
        />
        <Row
          media={<Media icon="cert" tone="warn" />}
          subject="api.acme.com"
          rest=" certificate request"
          meta="1h"
          description="deploy-bot. Profile web-tls."
        />
      </Case>
      <Case id="short-title" caption="Short titles">
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
      </Case>
      <Case id="timestamp-widths" caption="Timestamp widths: the slot sizes to its text">
        {(["4m", "12m", "3h", "2d", "Nov 4"] as const).map((meta) => (
          <Row
            key={meta}
            media={<Media icon="key" tone="ok" />}
            subject="12 secrets"
            rest=" changed in ledger-core, production"
            meta={meta}
            description="Dana Wu. Needs 2 approvals."
          />
        ))}
      </Case>
    </div>
  );
}
