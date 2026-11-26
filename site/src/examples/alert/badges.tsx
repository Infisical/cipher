import { Alert } from "@infisical/cipher/ui/alert";
import { Badge } from "@infisical/cipher/ui/badge";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";

const docs = "https://infisical.com/docs/documentation/platform/secret-rotation/overview";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-4">
      <Alert
        tone="warn"
        title="Rotation is paused"
        badges={
          <>
            <DocumentationLink href={docs} subject="secret rotation" />
            <Badge tone="warn">Production</Badge>
          </>
        }
      >
        Resume rotation before the current credentials expire in 7 days.
      </Alert>
      <Alert tone="info" badges={<DocumentationLink href={docs} subject="secret rotation" />}>
        Rotated credentials reach every environment that imports this folder.
      </Alert>
      <Alert
        tone="bad"
        title="Rotation failed for payments-ledger-replication-readwrite-us-east-1-primary"
        badges={
          <>
            <DocumentationLink href={docs} subject="secret rotation" />
            <Badge tone="outline">PostgreSQL</Badge>
            <Badge tone="outline">Retried 3 times</Badge>
          </>
        }
        onDismiss={() => undefined}
      >
        The database rejected the new password. Check that the rotation user can alter roles.
      </Alert>
      <Alert
        badges={<DocumentationLink href={docs} subject="secret rotation" />}
        onDismiss={() => undefined}
      >
        Each rotation creates a new credential, waits for every consumer to pick it up, then revokes
        the previous one, so a long interval keeps two credentials alive at once.
      </Alert>
    </div>
  );
}
