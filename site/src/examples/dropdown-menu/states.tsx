import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";

const stateLabel = (checked: boolean | "indeterminate") => {
  if (checked === "indeterminate") return "Mixed";
  return checked ? "Checked" : "Unchecked";
};
export default function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {([false, true, "indeterminate"] as const).map((checked) => (
        <figure
          key={String(checked)}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.DropdownMenu>
              <UI.DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Open menu
                </Button>
              </UI.DropdownMenuTrigger>
              <UI.DropdownMenuContent>
                <UI.DropdownMenuCheckboxItem checked={checked} disabled>
                  Include deployment-client metadata and inherited environment permissions
                </UI.DropdownMenuCheckboxItem>
                <UI.DropdownMenuCheckboxItem checked={checked} disabled description="Access denied">
                  Multi-line encoding
                </UI.DropdownMenuCheckboxItem>
                <UI.DropdownMenuItem onSelect={() => setSelected(true)}>
                  Connection details
                </UI.DropdownMenuItem>
              </UI.DropdownMenuContent>
            </UI.DropdownMenu>
          </div>
          <figcaption className="text-muted-foreground text-xs">{stateLabel(checked)}</figcaption>
        </figure>
      ))}
      {selected && (
        <p role="status" className="sr-only">
          Staging connection: vault.example.test
        </p>
      )}
    </div>
  );
}
