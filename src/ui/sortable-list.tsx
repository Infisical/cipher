import * as React from "react";
import { Reorder, useDragControls, useReducedMotion } from "motion/react";

import { FrameScope, useInFrame } from "../lib/frame-context";
import { snap, spring } from "../lib/motion";
import { useSortable } from "../lib/sortable";
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

/** The grip button every sortable surface uses: label it with the item's name, and key it so focus follows the item through a move. */
export function SortableHandle({
  itemKey,
  label,
  instructions,
  lifted,
  disabled,
  onPointerDown,
  onKeyDown,
  onBlur
}: {
  itemKey: string;
  label: string;
  instructions: string;
  lifted: boolean;
  disabled: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
}) {
  return (
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
        onPointerDown(event);
      }}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      {`Reorder ${label}`}
    </Button>
  );
}

/** Screen reader instructions for the handles and the live region that announces each move. */
export function SortableAnnouncer({
  instructions,
  announcement,
  children
}: {
  instructions: string;
  announcement: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span id={instructions} className={styles.sr}>
        {children}
      </span>
      <span className={styles.sr} role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  );
}

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
  const sort = useSortable({ items, getKey, getLabel, onReorder });
  const held = sort.lift ? items[sort.lift.from] : undefined;

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
          ref={(node: HTMLUListElement | null) => {
            sort.container.current = node;
          }}
          as="ul"
          axis="y"
          values={sort.preview as T[]}
          onReorder={(next) => {
            if (held !== undefined) sort.moveTo(next.indexOf(held));
          }}
          className={cn(styles.list, framed && frame.frameInset)}
          aria-label={label}
        >
          {sort.preview.map((item, index) => {
            const key = getKey(item);
            const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
            const lifted = sort.lift?.key === key;
            return (
              <SortableRow
                key={key}
                item={item}
                size={size}
                disabled={itemDisabled}
                lifted={lifted}
                transition={reduced ? snap : spring.moderate}
                onDragEnd={sort.drop}
                handle={(controls) => (
                  <SortableHandle
                    itemKey={key}
                    label={getLabel(item)}
                    instructions={sort.instructions}
                    lifted={lifted && !sort.lift?.pointer}
                    disabled={itemDisabled}
                    onPointerDown={(event) => {
                      if (sort.lift) return;
                      sort.pick(item, true);
                      controls.start(event);
                    }}
                    onKeyDown={(event) =>
                      sort.keyDown(
                        event,
                        item,
                        event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0
                      )
                    }
                    onBlur={(event) => sort.blur(event, item)}
                  />
                )}
              >
                {renderItem(item, {
                  index,
                  dragging: lifted,
                  disabled: itemDisabled
                })}
              </SortableRow>
            );
          })}
        </Reorder.Group>
        <SortableAnnouncer instructions={sort.instructions} announcement={sort.announcement}>
          Press Space or Enter to pick up, then use the arrow keys to move. Alt with an arrow key
          moves one step.
        </SortableAnnouncer>
      </div>
    </FrameScope>
  );
}

function SortableRow<T>({
  item,
  size,
  disabled,
  lifted,
  transition,
  onDragEnd,
  handle,
  children
}: {
  item: T;
  size: "md" | "sm";
  disabled: boolean;
  lifted: boolean;
  transition: typeof snap | (typeof spring)["moderate"];
  onDragEnd: () => void;
  handle: (controls: ReturnType<typeof useDragControls>) => React.ReactNode;
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
        onDragEnd();
      }}
      className={cn(styles.listRow, sortable.row)}
      data-slot="sortable-list-item"
      data-size={size}
      data-disabled={disabled || undefined}
      data-dragging={dragging || lifted || undefined}
    >
      <span className={sortable.handleSlot}>{handle(controls)}</span>
      <div className={sortable.body}>{children}</div>
    </Reorder.Item>
  );
}
