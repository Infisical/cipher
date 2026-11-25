import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { List, ListRow } from "@infisical/cipher/ui/list";

const panel = "w-full min-w-0 border border-(--cipher-line-soft) bg-(--cipher-surface) py-2";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 items-start gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,320px)]">
      <div className={panel}>
        <List
          inset
          variant="bare"
          label="Notifications"
          title="Notifications"
          action={
            <Button
              variant="ghost"
              size="icon-sm"
              icon="check"
              iconOnly
              aria-label="Mark all as read"
            />
          }
        >
          <ListRow
            value="gateway"
            label="Gateway health alert"
            title="Gateway health alert"
            description="edge-eu-1 has not checked in for 10 minutes."
            media={<Icon name="server" />}
            meta="4m"
            unread
            onClick={() => {}}
          />
          <ListRow
            value="change"
            label="Secret change request"
            title="Secret change request"
            description="A change to payments-api in production is waiting for your review."
            media={<Icon name="git" />}
            actions={
              <Button
                variant="ghost"
                size="icon-sm"
                icon="more"
                iconOnly
                aria-label="More actions"
              />
            }
            current
            onClick={() => {}}
          />
          <ListRow
            value="rotation"
            label="Secret rotation failed"
            title="Secret rotation failed for postgres-orders-primary-read-replica-credentials"
            description="Your PostgreSQL credentials rotation orders-db-rotation-eu-central-1-replica failed to rotate secrets after 3 attempts."
            media={<Icon name="sync" />}
            meta="21h"
            onClick={() => {}}
          />
        </List>
      </div>
      <div className={panel}>
        <List inset variant="bare" label="Unread notifications" empty="No unread notifications" />
      </div>
    </div>
  );
}
