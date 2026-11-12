import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/empty";
import { Icon } from "@infisical/cipher/ui/icon";

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <UI.Empty>
          <UI.EmptyMedia variant="tile">
            <Icon name="key" />
          </UI.EmptyMedia>
          <UI.EmptyHeader>
            <UI.EmptyTitle>No secrets in staging yet</UI.EmptyTitle>
            <UI.EmptyDescription>
              Add one, or copy them from development in one step. Syncs pick them up on the next
              push.
            </UI.EmptyDescription>
          </UI.EmptyHeader>
          <UI.EmptyContent>
            <Button icon="plus">Add secret</Button>
          </UI.EmptyContent>
        </UI.Empty>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"tile"}</figcaption>
    </figure>
  );
}
