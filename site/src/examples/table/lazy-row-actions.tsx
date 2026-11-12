import { DropdownMenuItem, DropdownMenuSeparator } from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";
import { toast } from "@infisical/cipher/ui/sonner";
import {
  type RowActionList,
  RowActions,
  RowContextMenu,
  Table,
  TableActionsCell,
  TableActionsHead,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@infisical/cipher/ui/table";

const names = [
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SIGNING_KEY",
  "SMTP_PASSWORD",
  "STRIPE_SECRET_KEY",
  "SENTRY_DSN",
  "S3_BUCKET",
  "LOG_LEVEL"
];

export default function LazyRowActions() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Table aria-label="Example secrets with lazy row actions">
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableActionsHead slots={2}>Actions</TableActionsHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {names.map((name) => {
                const inline: RowActionList = [
                  {
                    label: "Copy secret",
                    icon: "copy",
                    disabledReason:
                      name === "JWT_SIGNING_KEY" ? "Cannot copy rotated secret" : undefined,
                    onSelect: () => toast(`Copied the fabricated value of ${name}.`)
                  }
                ];
                const menu = (
                  <>
                    <DropdownMenuItem onSelect={() => toast(`Opened ${name}.`)}>
                      <Icon name="eye" />
                      Open secret
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => toast(`Deleted ${name}.`)}
                    >
                      <Icon name="trash" />
                      Delete secret
                    </DropdownMenuItem>
                  </>
                );
                return (
                  <RowContextMenu key={name} label={name} inline={inline} menu={menu}>
                    <TableRow>
                      <TableCell>{name}</TableCell>
                      <TableActionsCell slots={2}>
                        <RowActions lazy label={name} inline={inline} menu={menu} />
                      </TableActionsCell>
                    </TableRow>
                  </RowContextMenu>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "Lazy row actions: plain buttons until a row is hovered or focused, then tooltips and the More menu"
          }
        </figcaption>
      </figure>
    </div>
  );
}
