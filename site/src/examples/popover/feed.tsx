import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@infisical/cipher/ui/dropdown-menu";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { Icon, type IconName } from "@infisical/cipher/ui/icon";
import { List, ListRow } from "@infisical/cipher/ui/list";
import * as UI from "@infisical/cipher/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@infisical/cipher/ui/tabs";

import { OverlayStage } from "../overlay-stage";

type Notification = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  meta: string;
  unread?: boolean;
};

const notifications: Notification[] = [
  {
    id: "gateway",
    icon: "server",
    title: "Gateway health alert",
    description: "edge-eu-1 has not checked in for 10 minutes.",
    meta: "4m",
    unread: true
  },
  {
    id: "change",
    icon: "git",
    title: "Secret change request",
    description: "A change to payments-api in production is waiting for your review.",
    meta: "1h",
    unread: true
  },
  {
    id: "rotation",
    icon: "sync",
    title: "Secret rotation failed",
    description: "orders-db credentials failed to rotate after 3 attempts.",
    meta: "21h"
  },
  {
    id: "invite",
    icon: "users",
    title: "Maya joined Platform",
    description: "Accepted your invitation with the Developer role.",
    meta: "2d"
  },
  {
    id: "expiry",
    icon: "key",
    title: "Certificate expires soon",
    description: "api.example.test expires in 14 days.",
    meta: "3d"
  },
  {
    id: "access",
    icon: "lock",
    title: "Access request approved",
    description: "Read access to staging was granted for 8 hours.",
    meta: "5d"
  }
];

export function NotificationsFeed({ items }: { items: Notification[] }) {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState("all");
  const shown = tab === "unread" ? items.filter((item) => item.unread) : items;
  return (
    <UI.Popover open={open} onOpenChange={setOpen}>
      <UI.PopoverTrigger asChild>
        <Button variant="outline" size="icon" icon="bell" iconOnly aria-label="Notifications" />
      </UI.PopoverTrigger>
      <UI.PopoverContent
        size="feed"
        align="start"
        onFocusOutside={(event) => event.preventDefault()}
      >
        <UI.PopoverHeader
          menu={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" icon="more" iconOnly aria-label="Options" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Mute for 1 hour</DropdownMenuItem>
                <DropdownMenuItem>Notification settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          action={
            <Button
              variant="ghost"
              size="icon-sm"
              icon="check"
              iconOnly
              aria-label="Mark all as read"
            />
          }
          tabs={
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList aria-label="Filter notifications">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <UI.PopoverTitle>Notifications</UI.PopoverTitle>
        </UI.PopoverHeader>
        {shown.length === 0 ? (
          <EmptyState icon="bell" title="You're all caught up" />
        ) : (
          <List inset variant="bare" label="Notifications">
            {shown.map((item) => (
              <ListRow
                key={item.id}
                value={item.id}
                label={item.title}
                title={item.title}
                description={item.description}
                media={<Icon name={item.icon} />}
                meta={item.meta}
                unread={item.unread}
                onClick={() => {}}
              />
            ))}
          </List>
        )}
        <UI.PopoverFooter>
          <Button variant="ghost" size="sm" className="w-full">
            View all activity
          </Button>
        </UI.PopoverFooter>
      </UI.PopoverContent>
    </UI.Popover>
  );
}

export default function Example() {
  return (
    <OverlayStage height={760}>
      <NotificationsFeed items={notifications} />
    </OverlayStage>
  );
}
