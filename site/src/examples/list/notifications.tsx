import { Button } from "@infisical/cipher/ui/button";
import * as Menu from "@infisical/cipher/ui/dropdown-menu";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListRow } from "@infisical/cipher/ui/list";

const rows = [
  {
    value: "gateway",
    title: "Gateway health alert",
    description:
      "edge-eu-1 has not checked in for 10 minutes. Requests through it are failing over.",
    icon: "server",
    meta: "4m",
    unread: true
  },
  {
    value: "change",
    title: "Secret change request",
    description:
      "A change to payments-api in production is waiting for your review before it applies.",
    icon: "git",
    meta: "1h"
  },
  {
    value: "rotation",
    title: "Secret rotation failed for postgres-orders-primary-read-replica-credentials",
    description:
      "Your PostgreSQL credentials rotation orders-db-rotation-eu-central-1-replica failed to rotate secrets after 3 attempts.",
    icon: "sync",
    meta: "21h"
  }
] as const;

export default function Example() {
  return (
    <div className="w-full max-w-[420px] min-w-0 border border-(--cipher-line-soft) bg-(--cipher-surface)">
      <List inset variant="bare" label="Notifications" title="Notifications">
        {rows.map((row) => (
          <ListRow
            key={row.value}
            value={row.value}
            label={row.title}
            title={row.title}
            description={row.description}
            media={<Media icon={row.icon} size={32} />}
            meta={row.meta}
            unread={"unread" in row}
            onClick={() => {}}
            actions={
              <Menu.DropdownMenu>
                <Menu.DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    icon="more"
                    iconOnly
                    aria-label="More actions"
                  />
                </Menu.DropdownMenuTrigger>
                <Menu.DropdownMenuContent align="end">
                  <Menu.DropdownMenuItem>Mark as read</Menu.DropdownMenuItem>
                  <Menu.DropdownMenuItem>Mute this alert</Menu.DropdownMenuItem>
                </Menu.DropdownMenuContent>
              </Menu.DropdownMenu>
            }
          />
        ))}
      </List>
    </div>
  );
}
