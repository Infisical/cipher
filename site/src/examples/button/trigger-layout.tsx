import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@infisical/cipher/ui/dropdown-menu";
import { Select } from "@infisical/cipher/ui/select";

const environments = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "preview", label: "Preview for pull request 4821, payments-api checkout redesign" }
];

function EnvironmentMenu({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const label = environments.find((environment) => environment.value === value)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          layout="trigger"
          className="w-56"
          aria-label={`Environment: ${label}`}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          {environments.map((environment) => (
            <DropdownMenuRadioItem key={environment.value} value={environment.value}>
              {environment.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EnvironmentMenu initial="production" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Button layout trigger"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="w-56">
            <Select aria-label="Environment" options={environments} defaultValue="production" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"SelectTrigger"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EnvironmentMenu initial="preview" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Long value truncates"}</figcaption>
      </figure>
    </div>
  );
}
