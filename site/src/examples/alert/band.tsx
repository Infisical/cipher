import { useState } from "react";

import { Alert } from "@infisical/cipher/ui/alert";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@infisical/cipher/ui/table";

const rows = ["API_BASE_URL", "DATABASE_URL", "STRIPE_WEBHOOK_SIGNING_SECRET_PRODUCTION_EU_WEST_1"];

const Frame = ({ folder, children }: { folder: string; children: React.ReactNode }) => (
  <div className="w-full min-w-0 border border-[var(--cipher-line-soft)]">
    <div className="flex min-h-10 items-center gap-2 border-b border-[var(--cipher-line)] px-3">
      <Icon name="folder" />
      <span className="text-sm font-medium">{folder}</span>
    </div>
    {children}
    <Table>
      <TableHeader ground="paper">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((name) => (
          <TableRow key={name}>
            <TableCell className="font-mono">{name}</TableCell>
            <TableCell className="font-mono">••••••••••••</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Frame folder="services">
        {visible ? (
          <Alert band tone="info" onDismiss={() => setVisible(false)}>
            2 changes need your approval. <a href="#review">Review</a>
          </Alert>
        ) : (
          <div className="border-b border-[var(--cipher-line-soft)] p-3">
            <Button variant="outline" onClick={() => setVisible(true)}>
              Show notice
            </Button>
          </div>
        )}
      </Frame>
      <Frame folder="billing">
        <Alert band tone="warn">
          This folder is read-only while a rotation runs.
        </Alert>
      </Frame>
      <Frame folder="payments">
        <Alert band tone="bad" title="Sync failed" onDismiss={() => undefined}>
          The AWS Parameter Store integration could not authenticate. Reconnect it to resume
          syncing.
        </Alert>
      </Frame>
    </div>
  );
}
