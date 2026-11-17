import * as React from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

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

type Box = { left: number; top: number; width: number; height: number };
type Drag = {
  slots: Box[];
  grab: { x: number; y: number };
  pointer: { x: number; y: number };
};

const center = (box: Box) => ({ x: box.left + box.width / 2, y: box.top + box.height / 2 });

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const drag = React.useRef<Drag | null>(null);
  const [held, setHeld] = React.useState<string | null>(null);

  const origin = () => list.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
  const place = () => {
    const current = drag.current;
    const lift = sort.liftRef.current;
    if (!current || !lift) return;
    const slot = current.slots[lift.to];
    if (!slot) return;
    const { left, top } = origin();
    x.set(current.pointer.x - left - current.grab.x - slot.left);
    y.set(current.pointer.y - top - current.grab.y - slot.top);
  };
  const follow = (event: PointerEvent) => {
    const current = drag.current;
    const lift = sort.liftRef.current;
    if (!current || !lift) return;
    current.pointer = { x: event.clientX, y: event.clientY };
    const { left, top } = origin();
    const from = current.slots[lift.from]!;
    const card = {
      x: event.clientX - left - current.grab.x + from.width / 2,
      y: event.clientY - top - current.grab.y + from.height / 2
    };
    const distance = (box: Box) => Math.hypot(center(box).x - card.x, center(box).y - card.y);
    let best = lift.to;
    current.slots.forEach((slot, index) => {
      if (distance(slot) < distance(current.slots[best]!)) best = index;
    });
    const slot = current.slots[lift.to]!;
    const hysteresis = Math.min(slot.width, slot.height) * 0.25;
    if (best !== lift.to && distance(current.slots[best]!) < distance(slot) - hysteresis)
      sort.moveTo(best);
    else place();
  };
  React.useLayoutEffect(place, [sort.lift?.to]);
  const startDrag = (item: T, event: React.PointerEvent) => {
    const container = list.current;
    if (!container) return;
    const { left, top } = container.getBoundingClientRect();
    const slots = Array.from(container.children).map((element) => {
      const box = element.getBoundingClientRect();
      return { left: box.left - left, top: box.top - top, width: box.width, height: box.height };
    });
    const from = slots[items.indexOf(item)];
    if (!from) return;
    const key = getKey(item);
    drag.current = {
      slots,
      grab: { x: event.clientX - left - from.left, y: event.clientY - top - from.top },
      pointer: { x: event.clientX, y: event.clientY }
    };
    x.set(0);
    y.set(0);
    setHeld(key);
    sort.pick(item, true);
    const stop = () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      drag.current = null;
      const settle = reduced ? snap : spring.moderate;
      Promise.all([animate(x, 0, settle), animate(y, 0, settle)]).then(() =>
        setHeld((current) => (current === key ? null : current))
      );
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
          const following = held === key;
          return (
            <motion.li
              key={key}
              layout={following ? false : "position"}
              transition={reduced ? snap : spring.moderate}
              className={styles.item}
              data-slot="sortable-grid-item"
              data-dragging={lifted || following || undefined}
              data-following={following || undefined}
              data-disabled={itemDisabled || undefined}
            >
              <motion.div className={styles.card} style={following ? { x, y } : undefined}>
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
                      onPointerDown={(event) => {
                        if (!sort.lift && !held) startDrag(item, event);
                      }}
                      onKeyDown={(event) => sort.keyDown(event, item, delta(event.key))}
                      onBlur={(event) => sort.blur(event, item)}
                    />
                  )
                })}
              </motion.div>
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
