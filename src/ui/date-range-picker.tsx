import * as React from "react";
import type { DateRange, Locale, Matcher } from "react-day-picker";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import controlStyles from "./controls.module.css";
import styles from "./date-picker.module.css";

export type CompleteDateRange = { from: Date; to: Date };
export type DateRangePreset = { label: string; range: DateRange };

export type DateRangePickerProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "disabled" | "children" | "placeholder"
> & {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  /** Days that cannot be picked, as Calendar matchers. An open-ended before or after also stops month navigation there. */
  disabled?: Matcher | Matcher[];
  numberOfMonths?: number;
  presets?: readonly DateRangePreset[];
  align?: "start" | "center" | "end";
  locale?: Partial<Locale>;
  formatRange?: (range: CompleteDateRange) => string;
  ref?: React.Ref<HTMLButtonElement>;
};

const isComplete = (range: DateRange | undefined): range is CompleteDateRange =>
  Boolean(range?.from && range.to);

const sameDay = (a: Date | undefined, b: Date | undefined) =>
  Boolean(a && b && a.toDateString() === b.toDateString());

/** The range after a click: the first click starts a new range even over a complete one, and the second closes it in either direction. */
export const pickRange = (range: DateRange | undefined, day: Date): DateRange => {
  if (!range?.from || range.to) return { from: day, to: undefined };
  return day < range.from ? { from: day, to: range.from } : { from: range.from, to: day };
};

const defaultFormat = (range: CompleteDateRange, locale?: Partial<Locale>) => {
  const format = (date: Date) =>
    date.toLocaleDateString(locale?.code, { month: "short", day: "numeric", year: "numeric" });
  return `${format(range.from)} to ${format(range.to)}`;
};

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Choose dates",
  disabled,
  numberOfMonths = 1,
  presets,
  align = "start",
  locale,
  formatRange,
  className,
  ...props
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const format = (range: CompleteDateRange) => formatRange?.(range) ?? defaultFormat(range, locale);
  const commit = (next: DateRange | undefined) => {
    onValueChange(next);
    setOpen(false);
  };
  const changeOpen = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };
  let status = "Choose a start date";
  if (draft?.from && !draft.to) status = "Choose an end date";
  else if (isComplete(draft)) status = format(draft);

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-range-picker"
          variant="outline"
          layout="trigger"
          iconRight="calendar"
          className={className}
          {...props}
        >
          {isComplete(value) ? (
            format(value)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        data-width="content"
        aria-label="Choose a date range"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div data-slot="date-range-picker-panel" className={styles.panel}>
          {presets?.length ? (
            <div
              role="group"
              aria-label="Presets"
              data-slot="date-range-picker-presets"
              className={styles.presets}
            >
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="justify-start"
                  aria-pressed={
                    sameDay(preset.range.from, value?.from) && sameDay(preset.range.to, value?.to)
                  }
                  onClick={() => commit(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          ) : null}
          <div className={styles.main}>
            <Calendar
              mode="range"
              autoFocus
              aria-label="Date range"
              locale={locale}
              numberOfMonths={numberOfMonths}
              disabled={disabled}
              defaultMonth={draft?.from}
              selected={draft}
              onSelect={(_range, day) => {
                const next = pickRange(draft, day);
                setDraft(next);
                if (isComplete(next)) commit(next);
              }}
            />
            <div data-slot="date-range-picker-footer" className={styles.footer}>
              <span role="status" className={cn(controlStyles.caption, styles.status)}>
                {status}
              </span>
              {value?.from || draft?.from ? (
                <Button variant="ghost" size="xs" onClick={() => commit(undefined)}>
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
DateRangePicker.displayName = "DateRangePicker";
