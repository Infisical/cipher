import * as React from "react";

type Entry = {
  element: () => HTMLElement | null;
  scope: "page" | "card";
  trigger: () => void;
};

const entries = new Set<Entry>();

const editing = [
  "input",
  "textarea",
  "select",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='textbox']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='menu']",
  ".cm-editor",
  ".monaco-editor",
  ".xterm"
].join(", ");

const overlays = "[role='dialog'], [role='alertdialog'], [data-radix-popper-content-wrapper]";

const isEditing = (node: EventTarget | Element | null) =>
  node instanceof Element && Boolean(node.closest(editing));

const isAvailable = (element: HTMLElement) => {
  if (!element.isConnected || element.getClientRects().length === 0) return false;
  if (element.closest("[inert], [aria-hidden='true']")) return false;
  if (element instanceof HTMLInputElement && (element.disabled || element.readOnly)) return false;
  if (element instanceof HTMLButtonElement && element.disabled) return false;
  const open = Array.from(document.querySelectorAll<HTMLElement>(overlays)).filter(
    (overlay) => overlay.getClientRects().length > 0
  );
  return open.every((overlay) => overlay.contains(element));
};

const inDocumentOrder = (a: HTMLElement, b: HTMLElement) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.repeat || event.isComposing || event.defaultPrevented) return;
  if (isEditing(event.target) || isEditing(document.activeElement)) return;
  const target = event.target instanceof Element ? event.target : null;
  const candidates = Array.from(entries)
    .map((entry) => ({ entry, element: entry.element() }))
    .filter(
      (candidate): candidate is { entry: Entry; element: HTMLElement } =>
        candidate.element !== null && isAvailable(candidate.element)
    )
    .filter(({ entry, element }) => {
      if (entry.scope === "page") return true;
      const card = element.closest('[data-slot="card"]');
      return Boolean(card && target && card.contains(target));
    })
    .sort((a, b) => {
      if (a.entry.scope !== b.entry.scope) return a.entry.scope === "card" ? -1 : 1;
      return inDocumentOrder(a.element, b.element);
    });
  const winner = candidates[0];
  if (!winner) return;
  event.preventDefault();
  winner.entry.trigger();
};

/**
 * Registers an element that "/" acts on. One document listener serves every registration, so
 * searches never compete: a card-scoped one wins while focus is inside its card, otherwise the first
 * visible page-scoped one in document order. "/" is ignored while typing in a field or editor, and
 * while a dialog or popover is open that doesn't contain the element.
 */
export function useSlashShortcut(
  element: React.RefObject<HTMLElement | null>,
  {
    enabled = true,
    scope = "page",
    onTrigger
  }: {
    enabled?: boolean;
    scope?: "page" | "card";
    onTrigger: () => void;
  }
) {
  const trigger = React.useEffectEvent(onTrigger);
  React.useEffect(() => {
    if (!enabled) return undefined;
    const entry: Entry = { element: () => element.current, scope, trigger: () => trigger() };
    if (entries.size === 0) document.addEventListener("keydown", onKeyDown, true);
    entries.add(entry);
    return () => {
      entries.delete(entry);
      if (entries.size === 0) document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [element, enabled, scope]);
}
