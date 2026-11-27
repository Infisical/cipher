import * as React from "react";

const owned = new WeakSet<Event>();
/** True when an overlay kept this Escape open for an escape owner inside it, so the owner still acts on the prevented event. */
export const isOwnedEscape = (event: Event) => owned.has(event);

export function useOwnedEscape<ElementType extends HTMLElement>(
  ref: React.Ref<ElementType> | undefined,
  onEscapeKeyDown?: (event: KeyboardEvent) => void
) {
  const content = React.useRef<ElementType | null>(null);
  const attach = React.useCallback(
    (node: ElementType | null) => {
      content.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  const handle = (event: KeyboardEvent) => {
    onEscapeKeyDown?.(event);
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const owner = event.target.closest("[data-cipher-escape-owner]");
    if (!owner || !content.current?.contains(owner)) return;
    event.preventDefault();
    owned.add(event);
  };
  return { ref: attach, onEscapeKeyDown: handle };
}
