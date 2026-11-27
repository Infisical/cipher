import { useState } from "react";

import { Alert } from "@infisical/cipher/ui/alert";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@infisical/cipher/ui/table";

const rows = ["API_BASE_URL", "DATABASE_URL", "STRIPE_WEBHOOK_SIGNING_SECRET_PRODUCTION_EU_WEST_1"];

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="w-full min-w-0 border border-[var(--cipher-line-soft)]">
      <div className="flex min-h-10 items-center gap-2 border-b border-[var(--cipher-line)] px-3">
        <Icon name="folder" />
        <span className="text-sm font-medium">services</span>
      </div>
      {visible ? (
        <Alert band tone="info" onDismiss={() => setVisible(false)}>
          2 changes need your approval. <a href="#review">Review</a>
        </Alert>
      ) : null}
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
      {!visible && (
        <div className="p-3">
          <Button variant="outline" onClick={() => setVisible(true)}>
            Show notice
          </Button>
        </div>
      )}
    </div>
  );
}
