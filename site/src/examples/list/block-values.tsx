import { Badge } from "@infisical/cipher/ui/badge";
import { CodeBlock } from "@infisical/cipher/ui/code-block";
import { DataList } from "@infisical/cipher/ui/list";

const policy = `{
  "effect": "allow",
  "actions": ["secrets:read", "secrets:list"],
  "resources": ["projects/payments-ledger/environments/production/*"]
}`;

export default function BlockValues() {
  return (
    <div className="w-full max-w-xl min-w-0">
      <DataList
        variant="props"
        density="compact"
        items={[
          ["Name", "payments-ledger-reader"],
          [
            "Status",
            <Badge key="status" tone="ok" dot>
              Active
            </Badge>
          ],
          [
            "Description",
            "Read-only access to production secrets for the ledger replication workers in every region"
          ],
          ["Policy", <CodeBlock key="policy" code={policy} label="policy.json" />],
          ["Script", <CodeBlock key="script" code="infisical run --env=prod -- ./replicate.sh" />]
        ]}
      />
    </div>
  );
}
