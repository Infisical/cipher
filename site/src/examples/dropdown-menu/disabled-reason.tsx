import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";

const logo = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="4" fill="${fill}"/></svg>`,
  )}`;

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
              <UI.DropdownMenuItem description="Last rotated 3 days ago">
                <Icon name="sync" />
                Rotate now
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem description="Moves every secret in this folder, including imported references and their version history, to another environment and rewrites the references that point here so nothing breaks">
                <Icon name="folder" />
                Move folder
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem disabledReason="Versioning is off for this project">
                <Icon name="history" />
                Version history
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem
                asChild
                disabledReason="Exports are off on this plan"
              >
                <a href="https://infisical.com/docs">
                  <Icon name="download" />
                  Export
                </a>
              </UI.DropdownMenuItem>
              <UI.DropdownMenuSeparator />
              <UI.DropdownMenuItem>
                <img src={logo("#1F6FEB")} alt="" data-menu-icon="" />
                Import from GitHub
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem description="Every secret in the default environment">
                <img src={logo("#7C3AED")} alt="" data-menu-icon="" />
                Import from Doppler
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem disabledReason="Connect AWS first">
                <img src={logo("#FF9900")} alt="" data-menu-icon="" />
                Import from AWS
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
        <figcaption className="text-muted-foreground text-xs">
          {"Blocked by permission"}
        </figcaption>
      </figure>
    </div>
  );
}
