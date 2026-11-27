import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import {
  Command,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList
} from "@infisical/cipher/ui/command";
import { MultiSelectFooterAction } from "@infisical/cipher/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@infisical/cipher/ui/popover";
import { Meta } from "@infisical/cipher/ui/text";

const environments = [
  "Development",
  "Staging",
  "Production",
  "Production EU (Frankfurt, data residency)"
];

export default function Example() {
  const [value, setValue] = useState("Production");
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" icon="layers">
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" surface="menu" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search environments" />
          <CommandList>
            {environments.map((environment) => (
              <CommandItem
                key={environment}
                value={environment}
                data-checked={environment === value}
                onSelect={() => {
                  setValue(environment);
                  setOpen(false);
                }}
              >
                {environment}
              </CommandItem>
            ))}
          </CommandList>
          <CommandFooter>
            <MultiSelectFooterAction icon="plus">Add environment</MultiSelectFooterAction>
          </CommandFooter>
          <CommandFooter>
            <p className="px-2 py-1">
              <Meta mono={false}>New environments start with no secrets.</Meta>
            </p>
          </CommandFooter>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
