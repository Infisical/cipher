import * as React from "react";

import { useControllableState } from "../lib/use-controllable-state";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Popover, PopoverAnchor, PopoverContent, PopoverHeader, PopoverTitle } from "./popover";
import { Spinner } from "./spinner";

import styles from "./event-calendar.module.css";

export type EventCalendarTone = "info" | "warn" | "bad" | "ok" | "accent" | "neutral";

export type EventCalendarEvent = {
  id: string;
  date: Date;
  label: string;
  /** Colour of the event's square dot and pill. Defaults to info. */
  tone?: EventCalendarTone;
  /** What kind of event it is, such as Rotation or Reminder, shown beside it in the day's list. */
  category?: string;
};

export type EventCalendarCategory = { label: string; tone: EventCalendarTone };

export type EventCalendarProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
  events: readonly EventCalendarEvent[];
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Rows of events a day shows; past it the last row becomes a "+N more" count. */
  maxEvents?: number;
  /** 0 is Sunday. Defaults to Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Shown as a legend under the grid. */
  categories?: readonly EventCalendarCategory[];
  /** Makes events clickable, in the grid and in a day's list. */
  onEventSelect?: (event: EventCalendarEvent) => void;
  loading?: boolean;
  /** Only its code is read, so a react-day-picker or date-fns Locale works. */
  locale?: { code?: string };
  ref?: React.Ref<HTMLDivElement>;
};

const dayKey = (date: Date) => date.toDateString();
const plural = (count: number) => `${count} event${count === 1 ? "" : "s"}`;
const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const addMonths = (date: Date, amount: number) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate();
  return new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), lastDay));
};
const startOfWeek = (date: Date, weekStartsOn: number) =>
  addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));

const moves: Record<string, (day: Date, weekStartsOn: number) => Date> = {
  ArrowLeft: (day) => addDays(day, -1),
  ArrowRight: (day) => addDays(day, 1),
  ArrowUp: (day) => addDays(day, -7),
  ArrowDown: (day) => addDays(day, 7),
  Home: (day, weekStartsOn) => startOfWeek(day, weekStartsOn),
  End: (day, weekStartsOn) => addDays(startOfWeek(day, weekStartsOn), 6),
  PageUp: (day) => addMonths(day, -1),
  PageDown: (day) => addMonths(day, 1)
};

export function EventCalendar({
  events,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  maxEvents = 2,
  weekStartsOn = 1,
  categories,
  onEventSelect,
  loading = false,
  locale,
  className,
  ...props
}: EventCalendarProps) {
  const [month, setMonth] = useControllableState({
    value: monthProp && startOfMonth(monthProp),
    defaultValue: startOfMonth(defaultMonth ?? new Date()),
    onChange: onMonthChange
  });
  const today = new Date();
  const [focused, setFocused] = React.useState<Date>(() =>
    sameMonth(today, month) ? today : month
  );
  const [openDay, setOpenDay] = React.useState<Date | null>(null);
  const grid = React.useRef<HTMLDivElement>(null);
  const anchor = React.useRef<HTMLElement | null>(null);
  const moveFocus = React.useRef(false);
  const interactedOutside = React.useRef(false);
  const id = React.useId();

  const monthTime = month.getTime();
  const weeks = React.useMemo(() => {
    const first = new Date(monthTime);
    const leading = (first.getDay() - weekStartsOn + 7) % 7;
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil((leading + daysInMonth) / 7) }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day - leading))
    );
  }, [monthTime, weekStartsOn]);
  const visibleKeys = React.useMemo(() => new Set(weeks.flat().map(dayKey)), [weeks]);

  const focusedDay = visibleKeys.has(dayKey(focused)) ? focused : month;
  const focusedKey = dayKey(focusedDay);
  const openKey = openDay ? dayKey(openDay) : null;

  const byDay = React.useMemo(() => {
    const map = new Map<string, EventCalendarEvent[]>();
    for (const event of events) {
      const key = dayKey(event.date);
      const day = map.get(key);
      if (day) day.push(event);
      else map.set(key, [event]);
    }
    return map;
  }, [events]);

  React.useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLElement>(`[data-day="${focusedKey}"]`)?.focus();
  }, [focusedKey]);

  const shiftMonth = (amount: number) => {
    const next = addMonths(month, amount);
    setMonth(next);
    setFocused(sameMonth(today, next) ? today : next);
  };
  const open = (day: Date, element: HTMLElement) => {
    anchor.current = element;
    interactedOutside.current = false;
    setFocused(day);
    setOpenDay(day);
  };

  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString(locale?.code, options);
  const openEvents = openKey ? (byDay.get(openKey) ?? []) : [];

  const eventContent = (event: EventCalendarEvent, withCategory: boolean) => (
    <>
      <span aria-hidden className={styles.dot} />
      <span className={styles.eventLabel}>{event.label}</span>
      {withCategory && event.category ? (
        <span className={styles.eventCategory}>{event.category}</span>
      ) : null}
    </>
  );

  return (
    <div
      data-slot="event-calendar"
      role="group"
      className={cn(styles.root, className)}
      aria-busy={loading || undefined}
      {...props}
    >
      <div className={styles.toolbar}>
        <h2 id={`${id}-month`} aria-live="polite" className={styles.heading}>
          {format(month, { month: "long", year: "numeric" })}
        </h2>
        {loading ? <Spinner label="Loading events" /> : null}
        <div className={styles.nav}>
          <Button
            variant="ghost"
            size="icon-sm"
            icon="chev-left"
            iconOnly
            onClick={() => shiftMonth(-1)}
          >
            Previous month
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            icon="chev-right"
            iconOnly
            onClick={() => shiftMonth(1)}
          >
            Next month
          </Button>
        </div>
      </div>
      <Popover
        open={openDay !== null}
        onOpenChange={(next) => {
          if (!next) setOpenDay(null);
        }}
      >
        <PopoverAnchor virtualRef={anchor as React.RefObject<HTMLElement>} />
        <div
          ref={grid}
          role="grid"
          aria-labelledby={`${id}-month`}
          className={styles.grid}
          onKeyDown={(event) => {
            const move = moves[event.key];
            if (!move) return;
            event.preventDefault();
            const next = move(focusedDay, weekStartsOn);
            if (dayKey(next) === focusedKey) return;
            moveFocus.current = true;
            setFocused(next);
            const paging = event.key === "PageUp" || event.key === "PageDown";
            if (paging || !visibleKeys.has(dayKey(next))) setMonth(startOfMonth(next));
          }}
        >
          <div role="row" className={styles.row}>
            {weeks[0].map((day) => (
              <div
                key={day.getDay()}
                role="columnheader"
                aria-label={format(day, { weekday: "long" })}
                className={styles.weekday}
              >
                {format(day, { weekday: "short" })}
              </div>
            ))}
          </div>
          {weeks.map((week) => (
            <div key={dayKey(week[0])} role="row" className={styles.row}>
              {week.map((day) => {
                const key = dayKey(day);
                const dayEvents = byDay.get(key) ?? [];
                const overflow = dayEvents.length > maxEvents;
                const visible = overflow
                  ? dayEvents.slice(0, Math.max(maxEvents - 1, 0))
                  : dayEvents;
                const isToday = dayKey(day) === dayKey(today);
                const name = format(day, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                });
                return (
                  <div
                    key={key}
                    role="gridcell"
                    data-day={key}
                    data-outside={!sameMonth(day, month) || undefined}
                    data-today={isToday || undefined}
                    tabIndex={key === focusedKey ? 0 : -1}
                    aria-current={isToday ? "date" : undefined}
                    aria-haspopup="dialog"
                    aria-expanded={openKey === key}
                    aria-label={`${name}${isToday ? ", today" : ""}, ${dayEvents.length ? plural(dayEvents.length) : "no events"}`}
                    className={styles.day}
                    onFocus={() => setFocused(day)}
                    onClick={(event) => open(day, event.currentTarget)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      if (event.target !== event.currentTarget) return;
                      event.preventDefault();
                      open(day, event.currentTarget);
                    }}
                  >
                    <span aria-hidden className={styles.dayNumber}>
                      {day.getDate()}
                    </span>
                    {dayEvents.length ? (
                      <div className={styles.events}>
                        {visible.map((item) =>
                          onEventSelect ? (
                            <button
                              key={item.id}
                              type="button"
                              tabIndex={-1}
                              title={item.label}
                              data-tone={item.tone ?? "info"}
                              className={styles.pill}
                              onClick={(event) => {
                                event.stopPropagation();
                                onEventSelect(item);
                              }}
                            >
                              {eventContent(item, false)}
                            </button>
                          ) : (
                            <span
                              key={item.id}
                              title={item.label}
                              data-tone={item.tone ?? "info"}
                              className={styles.pill}
                            >
                              {eventContent(item, false)}
                            </span>
                          )
                        )}
                        {overflow ? (
                          <span aria-hidden className={styles.more}>
                            +{dayEvents.length - visible.length} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <PopoverContent
          align="start"
          aria-labelledby={`${id}-day`}
          className={styles.popover}
          onInteractOutside={() => {
            interactedOutside.current = true;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (!interactedOutside.current) anchor.current?.focus();
          }}
        >
          <PopoverHeader>
            <PopoverTitle id={`${id}-day`} className={styles.popoverTitle}>
              {openDay ? format(openDay, { weekday: "long", month: "long", day: "numeric" }) : null}
            </PopoverTitle>
            <p className={styles.popoverCount}>
              {openEvents.length ? plural(openEvents.length) : "No events"}
            </p>
          </PopoverHeader>
          {openEvents.length ? (
            <ul className={styles.list}>
              {openEvents.map((item) => (
                <li key={item.id} data-tone={item.tone ?? "info"} className={styles.tone}>
                  {onEventSelect ? (
                    <button
                      type="button"
                      className={styles.listItem}
                      onClick={() => {
                        setOpenDay(null);
                        onEventSelect(item);
                      }}
                    >
                      {eventContent(item, true)}
                    </button>
                  ) : (
                    <span className={styles.listItem}>{eventContent(item, true)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </PopoverContent>
      </Popover>
      {categories?.length ? (
        <ul aria-label="Legend" className={styles.legend}>
          {categories.map((category) => (
            <li key={category.label} data-tone={category.tone} className={styles.legendItem}>
              <span aria-hidden className={styles.dot} />
              {category.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
EventCalendar.displayName = "EventCalendar";
