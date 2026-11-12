import { type KeyboardEvent, useRef, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { CommandMenu } from "@infisical/cipher/ui/command-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@infisical/cipher/ui/tooltip";

export default function Example() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const shortcut = (event: KeyboardEvent<HTMLElement>) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.nativeEvent.isComposing ||
      event.key.toLowerCase() !== "k" ||
      !(event.metaKey || event.ctrlKey) ||
      (event.metaKey && event.ctrlKey) ||
      event.altKey ||
      event.shiftKey
    )
      return;
    if (
      event.target instanceof HTMLElement &&
      event.target.closest(
        'input, textarea, select, [role="textbox"], [role="combobox"], [contenteditable]:not([contenteditable="false"])'
      )
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    setSearch(true);
  };
  return (
    <section onKeyDownCapture={shortcut} aria-label="Tooltip actions">
      <TooltipProvider>
        <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
          <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
            <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
              <Tooltip content="Open search" shortcut="mod+K">
                <Button ref={trigger} variant="outline" onClick={() => setSearch(true)}>
                  Search components
                </Button>
              </Tooltip>
            </div>
            <figcaption className="text-muted-foreground text-xs">{"Shortcut hint"}</figcaption>
          </figure>
          <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
            <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
              <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                  <Button variant="outline" asChild>
                    <a href="#field">Retention settings</a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Versions remain available for 30 days.</TooltipContent>
              </Tooltip>
            </div>
            <figcaption className="text-muted-foreground text-xs">
              {"Controlled content"}
            </figcaption>
          </figure>
        </div>
        <CommandMenu
          hotkey={false}
          open={search}
          onOpenChange={setSearch}
          label="Find a component"
          groups={[
            {
              label: "Components",
              items: [
                { id: "input", label: "Input", href: "#input" },
                { id: "table", label: "Table", href: "#table" }
              ]
            }
          ]}
        />
      </TooltipProvider>
    </section>
  );
}
