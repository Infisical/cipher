import { DataList } from "@infisical/cipher/ui/list";
import { MiddleTruncate } from "@infisical/cipher/ui/middle-truncate";

export default function Example() {
  return (
    <div className="w-full max-w-xl min-w-0">
      <DataList
        variant="props"
        items={[
          ["Status", "Active"],
          [
            "Identity",
            <MiddleTruncate text="arn:aws:iam::918273645501:role/payments-ledger-replication-readwrite-us-east-1-primary" />
          ],
          ["Created", "Nov 16, 2026"],
          ["Owner", "jordan.lee@example.com"]
        ]}
      />
    </div>
  );
}
