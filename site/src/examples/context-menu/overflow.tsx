import * as React from "react";

import * as UI from "@infisical/cipher/ui/context-menu";

import { environments, OverlayStage } from "../overlay-stage";

export default function Example() {
  const trigger = React.useCallback((node: HTMLButtonElement | null) => {
    if (!node) return;
    const box = node.getBoundingClientRect();
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: box.left + 24,
        clientY: box.top + 24
      })
    );
  }, []);
  return (
    <OverlayStage>
      <UI.ContextMenu modal={false}>
        <UI.ContextMenuTrigger asChild>
          <button
            ref={trigger}
            type="button"
            className="text-muted-foreground flex h-full w-full items-start justify-start border border-dashed border-border p-4"
          >
            Right-click an environment
          </button>
        </UI.ContextMenuTrigger>
        <UI.ContextMenuContent>
          {environments.map((name) => (
            <UI.ContextMenuItem key={name}>{name}</UI.ContextMenuItem>
          ))}
        </UI.ContextMenuContent>
      </UI.ContextMenu>
    </OverlayStage>
  );
}
