import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.DropdownMenu>
            <UI.DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Secret actions
              </Button>
            </UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent>
              <UI.DropdownMenuItem>
                <Icon name="copy" />
                Copy value
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem disabledReason="Versioning is off for this project">
                <Icon name="history" />
                Version history
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem asChild disabledReason="Exports are off on this plan">
                <a href="https://infisical.com/docs">
                  <Icon name="download" />
                  Export
                </a>
              </UI.DropdownMenuItem>
              <UI.DropdownMenuSeparator />
              <UI.DropdownMenuItem
                variant="destructive"
                disabledReason="You need permission to delete secrets"
              >
                <Icon name="trash" />
                Delete
              </UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Blocked by permission"}</figcaption>
      </figure>
    </div>
  );
}
