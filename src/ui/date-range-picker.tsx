import * as React from "react";
import type { DateRange, Locale, Matcher } from "react-day-picker";

import { useIsMobile } from "../hooks/use-mobile";
import { useFieldControlAttributes } from "../lib/field-context";
import { cn, titleIfClamped } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
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
  /** Adds a start and end time under the calendar, so the value carries the time of day and the trigger shows it. New picks start at 00:00 and end at 23:59, and presets keep the times their dates carry. */
  withTime?: boolean;
  /** immediate commits as soon as both ends are picked. apply keeps picks and presets as a draft until Apply, and Cancel or closing discards it. Defaults to apply with withTime, presets or more than one month, so a half-picked range never reaches the value, else immediate. */
  commit?: "immediate" | "apply";
  align?: "start" | "center" | "end";
  locale?: Partial<Locale>;
  formatRange?: (range: CompleteDateRange) => string;
  /** A Badge after the range in the trigger, such as "Current" for the period that is still running. */
  badge?: React.ReactNode;
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

const sameMinute = (a: Date | undefined, b: Date | undefined) =>
  Boolean(a && b && Math.floor(a.getTime() / 60_000) === Math.floor(b.getTime() / 60_000));

const timeOf = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const atTime = (day: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(day);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

type RangeTimes = { from: string; to: string };

const rangeTimeError = (
  range: DateRange | undefined,
  times: RangeTimes
): { end: keyof RangeTimes; message: string } | undefined => {
  if (!range?.from) return undefined;
  if (!times.from) return { end: "from", message: "Enter a start time" };
  if (!times.to) return { end: "to", message: "Enter an end time" };
  if (range.to && range.to < range.from)
    return { end: "to", message: "End time is before the start time" };
  return undefined;
};

const defaultFormat = (range: CompleteDateRange, locale?: Partial<Locale>, withTime?: boolean) => {
  const format = (date: Date) =>
    withTime
      ? date.toLocaleString(locale?.code, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })
      : date.toLocaleDateString(locale?.code, { month: "short", day: "numeric", year: "numeric" });
  return `${format(range.from)} to ${format(range.to)}`;
};

export type DateRangePickerContentProps = Pick<
  DateRangePickerProps,
  | "value"
  | "disabled"
  | "numberOfMonths"
  | "presets"
  | "withTime"
  | "commit"
  | "align"
  | "locale"
  | "formatRange"
> & {
  /** The month shown first when value is empty. Defaults to the current month. */
  defaultMonth?: Date;
  onValueChange: (value: DateRange | undefined) => void;
  onClose: () => void;
  "aria-label"?: string;
};

type DateRangePanelProps = Omit<DateRangePickerContentProps, "align" | "aria-label"> & {
  numberOfMonths: number;
  commit: "immediate" | "apply";
};

function DateRangePanel({
  value,
  onValueChange,
  onClose,
  disabled,
  numberOfMonths,
  presets,
  withTime,
  commit: commitMode,
  defaultMonth,
  locale,
  formatRange
}: DateRangePanelProps) {
  const [draft, setDraft] = React.useState(value);
  const [month, setMonth] = React.useState(() => value?.from ?? defaultMonth ?? new Date());
  const [times, setTimes] = React.useState<RangeTimes>(() => ({
    from: value?.from ? timeOf(value.from) : "00:00",
    to: value?.to ? timeOf(value.to) : "23:59"
  }));
  const timeId = React.useId();
  const apply = commitMode === "apply";
  const format = (range: CompleteDateRange) =>
    formatRange?.(range) ?? defaultFormat(range, locale, withTime);
  const sameEnd = withTime ? sameMinute : sameDay;
  const timeError = withTime ? rangeTimeError(draft, times) : undefined;
  const canApply = !draft?.from || (isComplete(draft) && !timeError);
  const commit = (next: DateRange | undefined) => {
    onValueChange(next);
    onClose();
  };
  const choosePreset = (range: DateRange) => {
    if (withTime)
      setTimes({
        from: range.from ? timeOf(range.from) : times.from,
        to: range.to ? timeOf(range.to) : times.to
      });
    if (!apply) return commit(range);
    setDraft(range);
    if (range.from) setMonth(range.from);
  };
  const changeTime = (end: keyof RangeTimes, time: string) => {
    const nextTimes = { ...times, [end]: time };
    setTimes(nextTimes);
    const day = draft?.[end];
    if (!time || !day) return;
    const next = { ...draft, from: draft?.from, [end]: atTime(day, time) };
    setDraft(next);
    if (!apply && isComplete(next) && !rangeTimeError(next, nextTimes)) onValueChange(next);
  };
  const shown = apply ? draft : value;
  let status = "Choose a start date";
  if (draft?.from && !draft.to) status = "Choose an end date";
  else if (timeError) status = timeError.message;
  else if (isComplete(draft)) status = format(draft);

  return (
    <div data-slot="date-range-picker-panel" data-commit={commitMode} className={styles.panel}>
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
                sameEnd(preset.range.from, shown?.from) && sameEnd(preset.range.to, shown?.to)
              }
              onClick={() => choosePreset(preset.range)}
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
          month={month}
          onMonthChange={setMonth}
          selected={draft}
          onSelect={(_range, day) => {
            const picked = pickRange(draft, day);
            const next = withTime
              ? {
                  from: picked.from && atTime(picked.from, times.from || "00:00"),
                  to: picked.to && atTime(picked.to, times.to || "23:59")
                }
              : picked;
            setDraft(next);
            if (!apply && isComplete(next) && !(withTime && rangeTimeError(next, times)))
              commit(next);
          }}
        />
        {withTime ? (
          <div data-slot="date-range-picker-times" className={styles.times}>
            {(["from", "to"] as const).map((end) => (
              <div key={end} className={styles.time}>
                <Label htmlFor={`${timeId}-${end}`}>
                  {end === "from" ? "Start time" : "End time"}
                </Label>
                <Input
                  id={`${timeId}-${end}`}
                  type="time"
                  value={times[end]}
                  invalid={timeError?.end === end}
                  onChange={(event) => changeTime(end, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && apply && isComplete(draft) && canApply)
                      commit(draft);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
        <div data-slot="date-range-picker-footer" className={styles.footer}>
          <span role="status" className={cn(controlStyles.caption, styles.status)}>
            {status}
          </span>
          {apply ? (
            <div className={styles.actions}>
              {draft?.from ? (
                <Button variant="ghost" size="sm" onClick={() => setDraft(undefined)}>
                  Clear
                </Button>
              ) : null}
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" disabled={!canApply} onClick={() => commit(draft)}>
                Apply
              </Button>
            </div>
          ) : value?.from || draft?.from ? (
            <Button variant="ghost" size="xs" onClick={() => commit(undefined)}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** DateRangePicker's popover for your own trigger, such as a filter chip, with the same presets, months and commit rule. Render it inside a Popover. */
export function DateRangePickerContent({
  align = "start",
  numberOfMonths = 1,
  presets,
  withTime,
  commit = withTime || numberOfMonths > 1 || presets?.length ? "apply" : "immediate",
  "aria-label": ariaLabel = "Choose a date range",
  ...props
}: DateRangePickerContentProps) {
  const months = useIsMobile() ? 1 : numberOfMonths;
  return (
    <PopoverContent
      align={align}
      data-width={months > 1 ? undefined : "content"}
      className={months > 1 ? styles.wide : undefined}
      aria-label={ariaLabel}
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <DateRangePanel
        {...props}
        numberOfMonths={months}
        presets={presets}
        withTime={withTime}
        commit={commit}
      />
    </PopoverContent>
  );
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Choose dates",
  disabled,
  numberOfMonths,
  presets,
  withTime,
  commit,
  align,
  locale,
  formatRange,
  badge,
  className,
  ...props
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldControlAttributes(props);
  const generatedId = React.useId();
  const id = field.id ?? generatedId;
  const format = (range: CompleteDateRange) =>
    formatRange?.(range) ?? defaultFormat(range, locale, withTime);
  const valueText = React.useRef<HTMLSpanElement>(null);
  const valueLabel = isComplete(value) ? format(value) : undefined;
  React.useLayoutEffect(() => {
    if (valueText.current) titleIfClamped(valueText.current);
  }, [valueLabel]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-range-picker"
          variant="outline"
          layout="trigger"
          iconRight="calendar"
          className={className}
          {...props}
          {...field}
          id={id}
          aria-labelledby={field["aria-labelledby"] && `${field["aria-labelledby"]} ${id}`}
        >
          {isComplete(value) && badge !== undefined ? (
            <span className={controlStyles.triggerValue}>
              <span
                ref={valueText}
                data-slot="option-text"
                onPointerEnter={(event) => titleIfClamped(event.currentTarget)}
              >
                {format(value)}
              </span>
              {badge}
            </span>
          ) : isComplete(value) ? (
            format(value)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <DateRangePickerContent
        value={value}
        onValueChange={onValueChange}
        onClose={() => setOpen(false)}
        disabled={disabled}
        numberOfMonths={numberOfMonths}
        presets={presets}
        withTime={withTime}
        commit={commit}
        align={align}
        locale={locale}
        formatRange={formatRange}
      />
    </Popover>
  );
}
DateRangePicker.displayName = "DateRangePicker";
