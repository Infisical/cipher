import * as React from "react";
import { Reorder, useDragControls, useReducedMotion } from "motion/react";

import { FrameScope, useInFrame } from "../lib/frame-context";
import { snap, spring } from "../lib/motion";
import { cn } from "../lib/utils";
import { Button } from "./button";

import styles from "./data.module.css";
import frame from "./frame.module.css";
import sortable from "./sortable-list.module.css";

export interface SortableListItemState {
  index: number;
  /** True while the row is held, by pointer or keyboard. */
  dragging: boolean;
  disabled: boolean;
}
export interface SortableListProps<T> {
  items: readonly T[];
  getKey: (item: T) => string;
  /** Called once per committed move: on drop, on a keyboard drop, or on an Alt+Arrow step. Never during a drag. */
  onReorder: (nextItems: T[]) => void;
  renderItem: (item: T, state: SortableListItemState) => React.ReactNode;
  /** The item's name, used for its handle label and the announcements. */
  getLabel: (item: T) => string;
  /** Accessible name of the list. */
  label: string;
  variant?: "framed" | "plain";
  size?: "md" | "sm";
  disabled?: boolean;
  /** A disabled item keeps its handle inert, so it cannot be picked up; other items can still move past it. */
  isItemDisabled?: (item: T) => boolean;
  className?: string;
}

const move = <T,>(list: readonly T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
};

export function SortableList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  getLabel,
  label,
  variant: requestedVariant,
  size = "md",
  disabled = false,
  isItemDisabled,
  className
}: SortableListProps<T>) {
  const variant = requestedVariant ?? "framed";
  const inFrame = useInFrame("SortableList", requestedVariant);
  const embedded = inFrame && variant === "framed";
  const framed = variant === "framed" && !embedded;
  const reduced = useReducedMotion();
  const instructions = React.useId();
  const [draft, setDraft] = React.useState<T[] | null>(null);
  const [lifted, setLifted] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const draftRef = React.useRef<T[] | null>(null);
  const origin = React.useRef(0);
  const focusKey = React.useRef<string | null>(null);
  const list = React.useRef<HTMLUListElement>(null);
  const shown = draft ?? items;
  const total = shown.length;

  React.useLayoutEffect(() => {
    const key = focusKey.current;
    if (!key || !list.current) return;
    focusKey.current = null;
    const handle = Array.from(
      list.current.querySelectorAll<HTMLElement>("[data-sortable-handle]")
    ).find((element) => element.dataset.sortableHandle === key);
    if (handle && handle.ownerDocument.activeElement !== handle) handle.focus({ preventScroll: true });
  });

  const updateDraft = (next: T[] | null) => {
    draftRef.current = next;
    setDraft(next);
  };
  const changed = (next: readonly T[]) => next.some((item, index) => item !== items[index]);
  const position = (index: number) => `position ${index + 1} of ${total}`;
  const commit = (next: T[], item: T) => {
    updateDraft(null);
    setLifted(null);
    if (!changed(next)) return false;
    onReorder(next);
    setAnnouncement(`Dropped ${getLabel(item)} at ${position(next.indexOf(item))}.`);
    return true;
  };

  const keyDown = (event: React.KeyboardEvent, item: T) => {
    const key = getKey(item);
    const name = getLabel(item);
    const current = draftRef.current ?? [...items];
    const index = current.indexOf(item);
    const step = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (lifted === key) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!commit(current, item)) setAnnouncement(`Dropped ${name} at ${position(index)}.`);
      } else if (event.key === "Escape") {
        event.preventDefault();
        updateDraft(null);
        setLifted(null);
        focusKey.current = key;
        setAnnouncement(`Cancelled. ${name} returned to ${position(origin.current)}.`);
      } else if (step) {
        event.preventDefault();
        const target = index + step;
        if (target < 0 || target >= current.length) return;
        updateDraft(move(current, index, target));
        focusKey.current = key;
        setAnnouncement(`Moved ${name} to ${position(target)}.`);
      } else if (event.key === "Tab") {
        commit(current, item);
      }
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      origin.current = index;
      updateDraft(current);
      setLifted(key);
      setAnnouncement(
        `Picked up ${name}, ${position(index)}. Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`
      );
    } else if (step && event.altKey) {
      event.preventDefault();
      const target = index + step;
      if (target < 0 || target >= current.length) return;
      onReorder(move(current, index, target));
      focusKey.current = key;
      setAnnouncement(`Moved ${name} to ${position(target)}.`);
    }
  };

  return (
    <FrameScope framed={inFrame || framed}>
      <div
        className={cn(styles.listShell, framed && frame.frame, className)}
        data-slot="sortable-list"
        data-variant={variant}
        data-embedded={embedded || undefined}
        data-size={size}
        data-disabled={disabled || undefined}
      >
        <Reorder.Group
          ref={list}
          as="ul"
          axis="y"
          values={shown as T[]}
          onReorder={(next) => updateDraft(next)}
          className={cn(styles.list, framed && frame.frameInset)}
          aria-label={label}
        >
          {shown.map((item, index) => {
            const key = getKey(item);
            const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
            return (
              <SortableRow
                key={key}
                item={item}
                itemKey={key}
                label={getLabel(item)}
                size={size}
                disabled={itemDisabled}
                lifted={lifted === key}
                instructions={instructions}
                transition={reduced ? snap : spring.moderate}
                onStart={() => {
                  if (lifted) return;
                  updateDraft([...items]);
                }}
                onEnd={() => {
                  const next = draftRef.current;
                  if (next && !lifted) commit(next, item);
                }}
                onKeyDown={(event) => keyDown(event, item)}
                onBlur={(event) => {
                  if (lifted === key && event.relatedTarget) {
                    const next = draftRef.current;
                    if (next) commit(next, item);
                  }
                }}
              >
                {renderItem(item, { index, dragging: lifted === key, disabled: itemDisabled })}
              </SortableRow>
            );
          })}
        </Reorder.Group>
        <span id={instructions} className={styles.sr}>
          Press Space or Enter to pick up, then use the arrow keys to move. Alt with an arrow key moves one step.
        </span>
        <span className={styles.sr} role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </span>
      </div>
    </FrameScope>
  );
}

function SortableRow<T>({
  item,
  itemKey,
  label,
  size,
  disabled,
  lifted,
  instructions,
  transition,
  onStart,
  onEnd,
  onKeyDown,
  onBlur,
  children
}: {
  item: T;
  itemKey: string;
  label: string;
  size: "md" | "sm";
  disabled: boolean;
  lifted: boolean;
  instructions: string;
  transition: typeof snap | (typeof spring)["moderate"];
  onStart: () => void;
  onEnd: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  const [dragging, setDragging] = React.useState(false);
  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      transition={transition}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        onEnd();
      }}
      className={cn(styles.listRow, sortable.row)}
      data-slot="sortable-list-item"
      data-size={size}
      data-disabled={disabled || undefined}
      data-dragging={dragging || lifted || undefined}
    >
      <span className={sortable.handleSlot}>
        <Button
          variant="ghost"
          size="icon-row"
          icon="grip"
          iconOnly
          className={sortable.handle}
          aria-describedby={instructions}
          disabled={disabled}
          data-sortable-handle={itemKey}
          data-cipher-escape-owner={lifted || undefined}
          data-lifted={lifted || undefined}
          onPointerDown={(event) => {
            if (disabled || event.button !== 0) return;
            event.preventDefault();
            onStart();
            controls.start(event);
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        >
          {`Reorder ${label}`}
        </Button>
      </span>
      <div className={sortable.body}>{children}</div>
    </Reorder.Item>
  );
}
