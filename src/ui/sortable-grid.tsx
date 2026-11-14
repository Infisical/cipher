import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { snap, spring } from "../lib/motion";
import { useSortable } from "../lib/sortable";
import { cn } from "../lib/utils";
import { SortableAnnouncer, SortableHandle } from "./sortable-list";

import styles from "./sortable-grid.module.css";

export interface SortableGridItemState {
  index: number;
  /** True while the item is held, by pointer or keyboard. */
  dragging: boolean;
  disabled: boolean;
  /** The item's grip. Place it in the item, such as in a Card's action slot. */
  handle: React.ReactNode;
}
export interface SortableGridProps<T> {
  items: readonly T[];
  getKey: (item: T) => string;
  /** Called once per committed move: on drop, on a keyboard drop, or on an Alt+Arrow step. Never during a drag. */
  onReorder: (nextItems: T[]) => void;
  renderItem: (item: T, state: SortableGridItemState) => React.ReactNode;
  /** The item's name, used for its handle label and the announcements. */
  getLabel: (item: T) => string;
  /** Accessible name of the grid. */
  label: string;
  /** The narrowest a column gets before the grid drops a column, in pixels. */
  minItemWidth?: number;
  disabled?: boolean;
  /** A disabled item keeps its handle inert, so it cannot be picked up; other items can still move past it. */
  isItemDisabled?: (item: T) => boolean;
  className?: string;
}

const columnsOf = (container: HTMLElement | null) => {
  const items = Array.from(container?.children ?? []) as HTMLElement[];
  const top = items[0]?.offsetTop;
  return Math.max(1, items.filter((item) => item.offsetTop === top).length);
};

/** Items in responsive columns that a person puts in order, by dragging an item's grip or from the keyboard in two dimensions. */
export function SortableGrid<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  getLabel,
  label,
  minItemWidth = 240,
  disabled = false,
  isItemDisabled,
  className
}: SortableGridProps<T>) {
  const reduced = useReducedMotion();
  const sort = useSortable({ items, getKey, getLabel, onReorder });
  const list = React.useRef<HTMLUListElement>(null);

  const delta = (key: string) => {
    if (key === "ArrowLeft") return -1;
    if (key === "ArrowRight") return 1;
    const columns = columnsOf(list.current);
    if (key === "ArrowUp") return -columns;
    if (key === "ArrowDown") return columns;
    return 0;
  };
  const follow = (event: PointerEvent) => {
    const target = Array.from(list.current?.children ?? []).findIndex((element) => {
      const box = element.getBoundingClientRect();
      return (
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      );
    });
    if (target >= 0) sort.moveTo(target);
  };
  const startDrag = (item: T) => {
    sort.pick(item, true);
    const stop = () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", follow);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  return (
    <div
      className={cn(styles.shell, className)}
      data-slot="sortable-grid"
      data-disabled={disabled || undefined}
    >
      <ul
        ref={(node) => {
          list.current = node;
          sort.container.current = node;
        }}
        className={styles.grid}
        aria-label={label}
        style={
          {
            "--cipher-sortable-grid-min": `${minItemWidth}px`
          } as React.CSSProperties
        }
      >
        {sort.preview.map((item, index) => {
          const key = getKey(item);
          const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
          const lifted = sort.lift?.key === key;
          return (
            <motion.li
              key={key}
              layout="position"
              transition={reduced ? snap : spring.moderate}
              className={styles.item}
              data-slot="sortable-grid-item"
              data-dragging={lifted || undefined}
              data-disabled={itemDisabled || undefined}
            >
              {renderItem(item, {
                index,
                dragging: lifted,
                disabled: itemDisabled,
                handle: (
                  <SortableHandle
                    itemKey={key}
                    label={getLabel(item)}
                    instructions={sort.instructions}
                    lifted={lifted && !sort.lift?.pointer}
                    disabled={itemDisabled}
                    onPointerDown={() => {
                      if (!sort.lift) startDrag(item);
                    }}
                    onKeyDown={(event) => sort.keyDown(event, item, delta(event.key))}
                    onBlur={(event) => sort.blur(event, item)}
                  />
                )
              })}
            </motion.li>
          );
        })}
      </ul>
      <SortableAnnouncer instructions={sort.instructions} announcement={sort.announcement}>
        Press Space or Enter to pick up, then use the arrow keys to move across and between rows.
        Alt with an arrow key moves one step.
      </SortableAnnouncer>
    </div>
  );
}
