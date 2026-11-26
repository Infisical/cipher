import * as React from "react";
import { flushSync } from "react-dom";

/**
 * Whether the header actions around a Button are collapsed; undefined outside a header actions
 * slot. A collapsed Button with a leading icon renders icon-only and shows its label as a tooltip.
 */
export const ActionLabelCollapseContext = React.createContext<boolean | undefined>(undefined);

const overflows = (slot: HTMLElement) => {
  const row = slot.parentElement;
  if (!row) return false;
  if (row.scrollWidth > row.clientWidth + 1) return true;
  const list = row.querySelector<HTMLElement>('[role="tablist"]');
  if (list && list.scrollWidth > list.clientWidth + 1) return true;
  const title = list ? null : row.querySelector<HTMLElement>('[data-slot$="-title"]');
  if (title && title.offsetHeight > parseFloat(getComputedStyle(title).lineHeight) * 1.5)
    return true;
  return [...slot.querySelectorAll<HTMLElement>('[data-slot="button-text"]')].some(
    (label) => label.scrollWidth > label.clientWidth + 1
  );
};

/**
 * Collapses icon actions when the row cannot hold the tabs or the title on one line beside the
 * full-label actions. It re-measures when the row resizes, fonts load, or an action's content
 * changes; the mutations a measurement makes itself are discarded so it cannot loop. Every measurement lays the actions out expanded first, inside flushSync, so
 * the expanded and collapsed passes land in the same frame and no truncated frame is painted.
 */
export function HeaderActions({
  className,
  slot,
  children
}: {
  className?: string;
  slot: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const measuring = React.useRef(false);
  const mutations = React.useRef<MutationObserver | null>(null);
  const measure = React.useCallback(() => {
    const node = ref.current;
    if (!node || measuring.current) return;
    measuring.current = true;
    try {
      flushSync(() => setCollapsed(false));
      const next = overflows(node);
      if (next) flushSync(() => setCollapsed(true));
    } finally {
      mutations.current?.takeRecords();
      measuring.current = false;
    }
  }, []);
  React.useLayoutEffect(() => {
    if (!measuring.current) queueMicrotask(measure);
  });
  React.useLayoutEffect(() => {
    const node = ref.current;
    const row = node?.parentElement;
    if (!node || !row) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    const mutation = new MutationObserver(measure);
    mutation.observe(node, { childList: true, subtree: true, characterData: true });
    mutations.current = mutation;
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      mutation.disconnect();
      mutations.current = null;
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [measure]);
  return (
    <div ref={ref} data-slot={slot} data-collapsed={collapsed || undefined} className={className}>
      <ActionLabelCollapseContext value={collapsed}>{children}</ActionLabelCollapseContext>
    </div>
  );
}
