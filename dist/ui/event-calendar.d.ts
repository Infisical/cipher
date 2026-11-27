import * as React from "react";
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
export type EventCalendarCategory = {
    label: string;
    tone: EventCalendarTone;
};
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
    locale?: {
        code?: string;
    };
    ref?: React.Ref<HTMLDivElement>;
};
export declare function EventCalendar({ events, month: monthProp, defaultMonth, onMonthChange, maxEvents, weekStartsOn, categories, onEventSelect, loading, locale, className, ...props }: EventCalendarProps): React.JSX.Element;
export declare namespace EventCalendar {
    var displayName: string;
}
