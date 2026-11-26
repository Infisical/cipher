import { Badge } from "@infisical/cipher/ui/badge";
import { RowLink } from "@infisical/cipher/ui/row-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@infisical/cipher/ui/table";
import { StatusText } from "@infisical/cipher/ui/text";

const longReason =
  "AWS rejected the request with AccessDeniedException: the role arn:aws:iam::184467440737:role/infisical-secrets-sync is not allowed to call secretsmanager:PutSecretValue on prod/payments/STRIPE_WEBHOOK_SECRET. Grant that action to the role, then retry the sync.";
const shortReason = "Token expired on Nov 24";

const syncs = [
  { id: "aws", name: "AWS", tone: "bad", status: "Failed", reason: longReason },
  { id: "github", name: "GitHub", tone: "bad", status: "Failed", reason: shortReason },
  { id: "vercel", name: "Vercel", tone: "ok", status: "Synced", reason: undefined }
] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-wrap items-center gap-x-8 gap-y-4">
          <Badge tone="bad" dot reason={longReason}>
            Failed
          </Badge>
          <StatusText tone="bad" icon="alert" reason={longReason}>
            Sync failed
          </StatusText>
          <Badge tone="bad" dot reason={shortReason}>
            Failed
          </Badge>
          <StatusText tone="bad" icon="alert" reason={shortReason}>
            Sync failed
          </StatusText>
          <Badge tone="ok" dot>
            Synced
          </Badge>
          <StatusText tone="ok" icon="check-c">
            Synced
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"long reason, short reason, no reason"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Table aria-label="Secret syncs">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Destination</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Last run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncs.map((sync) => (
                <TableRow key={sync.id}>
                  <TableCell>
                    <RowLink link={{ href: "#/components/badge" }} chevron={false}>
                      {sync.name}
                    </RowLink>
                  </TableCell>
                  <TableCell>
                    <Badge tone={sync.tone} dot reason={sync.reason}>
                      {sync.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusText
                      tone={sync.tone}
                      icon={sync.reason ? "alert" : "check-c"}
                      reason={sync.reason}
                    >
                      {sync.reason ? "Failed" : "Synced"}
                    </StatusText>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"in rows that open with a RowLink"}
        </figcaption>
      </figure>
    </div>
  );
}
