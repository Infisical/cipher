import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Item, ItemGroup, Media, Tile } from "@infisical/cipher/ui/item";

export default function Example() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <ItemGroup>
        <Item
          title="Deployment service"
          description="Read access to production secrets."
          media={<Media icon="machine" />}
          badge={
            <Badge tone="ok" dot>
              Active
            </Badge>
          }
          meta="2 minutes ago"
          unread
          actions={
            <Button asChild variant="outline">
              <a href="#radio-group">View access guide</a>
            </Button>
          }
        />
        <Item
          title="Token needs attention"
          description="Its provider scope no longer permits reads."
          icon="alert"
          error="Update the token scope to reconnect."
          actionsPlacement="below"
          actions={
            <Button asChild variant="outline">
              <a href="#input">Provider settings</a>
            </Button>
          }
        />
      </ItemGroup>
      <Tile
        title="Vault provider"
        description="Connect an existing vault."
        media={<Media icon="lock" />}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    </div>
  );
}
